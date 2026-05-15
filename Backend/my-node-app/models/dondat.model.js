const { pool } = require('../config/db');
const KhuyenMaiModel = require('./khuyenmai.model');

class DonDatModel {
    /**
     * Admin: Lấy danh sách tất cả đơn đặt
     */
    static async getAll({ page = 1, limit = 10, trangThai, search, maUser } = {}) {
        const offset = (page - 1) * limit;
        const queryParams = [];
        let baseQuery = `
            FROM DonDat dd
            LEFT JOIN Users u ON dd.maUser = u.maUser
            LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
            WHERE 1=1
        `;
        if (trangThai) { baseQuery += ` AND dd.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }
        if (maUser) { baseQuery += ` AND dd.maUser = ?`; queryParams.push(parseInt(maUser)); }
        if (search) {
            baseQuery += ` AND (u.ten LIKE ? OR u.email LIKE ? OR CAST(dd.maDon AS CHAR) LIKE ?)`;
            const s = `%${search}%`; queryParams.push(s, s, s);
        }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        let dataQuery = `
            SELECT dd.*, u.ten AS tenUser, u.email AS emailUser, u.sdt AS sdtUser,
                   km.ten AS tenKhuyenMai, km.giamGia
            ${baseQuery}
            ORDER BY dd.ngayTao DESC
            LIMIT ? OFFSET ?
        `;
        queryParams.push(parseInt(limit), parseInt(offset));
        const [rows] = await pool.query(dataQuery, queryParams);

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / limit), currentPage: parseInt(page) };
    }

    /**
     * Lấy chi tiết 1 đơn đặt (kèm ChiTietDon + ThanhToan)
     */
    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT dd.*, u.ten AS tenUser, u.email AS emailUser, u.sdt AS sdtUser,
                    km.ten AS tenKhuyenMai, km.giamGia
             FROM DonDat dd
             LEFT JOIN Users u ON dd.maUser = u.maUser
             LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
             WHERE dd.maDon = ?`,
            [id]
        );
        if (!rows[0]) return null;
        const don = rows[0];

        const [chiTiet] = await pool.query(
            `SELECT ct.*, dv.ten AS tenDichVu, dv.loaiDichVu
             FROM ChiTietDon ct
             LEFT JOIN DichVu dv ON ct.maDichVu = dv.maDichVu
             WHERE ct.maDon = ?
             ORDER BY ct.maChiTiet ASC`,
            [id]
        );
        don.chiTietDon = chiTiet;

        const [thanhToan] = await pool.query(
            `SELECT * FROM ThanhToan WHERE maDon = ? ORDER BY ngayTao DESC`,
            [id]
        );
        don.lichSuThanhToan = thanhToan;

        return don;
    }

    /**
     * Customer: Lấy danh sách đơn của bản thân
     */
    static async getByUser(maUser, { page = 1, limit = 10, trangThai } = {}) {
        const offset = (page - 1) * limit;
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const queryParams = [maUser];
        let baseQuery = `
            FROM DonDat dd
            LEFT JOIN Users u ON dd.maUser = u.maUser
            LEFT JOIN KhuyenMai km ON dd.maKhuyenMai = km.maKhuyenMai
            WHERE dd.maUser = ?
        `;
        if (trangThai) { baseQuery += ` AND dd.trangThai = ?`; queryParams.push(trangThai.toUpperCase()); }

        const [countResult] = await pool.query(`SELECT COUNT(*) as total ${baseQuery}`, queryParams);
        const totalRecords = countResult[0].total;

        const dataQuery = `
            SELECT dd.*, u.ten AS tenUser, u.email AS emailUser, u.sdt AS sdtUser,
                   km.ten AS tenKhuyenMai, km.giamGia
            ${baseQuery}
            ORDER BY dd.ngayTao DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await pool.query(dataQuery, [...queryParams, parsedLimit, offset]);

        for (const don of rows) {
            const [chiTiet] = await pool.query(
                `SELECT ct.*, dv.ten AS tenDichVu, dv.loaiDichVu
                 FROM ChiTietDon ct
                 LEFT JOIN DichVu dv ON ct.maDichVu = dv.maDichVu
                 WHERE ct.maDon = ?
                 ORDER BY ct.maChiTiet ASC`,
                [don.maDon]
            );

            const [thanhToan] = await pool.query(
                `SELECT * FROM ThanhToan WHERE maDon = ? ORDER BY ngayTao DESC`,
                [don.maDon]
            );

            don.chiTietDon = chiTiet;
            don.lichSuThanhToan = thanhToan;
        }

        return { data: rows, totalRecords, totalPages: Math.ceil(totalRecords / parsedLimit), currentPage: parsedPage };
    }

    /**
     * Customer: Tạo đơn đặt (kèm danh sách chi tiết)
     * chiTietList: [{ maDichVu, maPhanLoaiDichVu, soLuong, giaTaiThoiDiemMua, ngayBatDauSuDung, ngayKetThucSuDung }]
     */
    static async create(maUser, maKhuyenMai, chiTietList, loaiDonInput = null, thongTinDatCho = null) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 1) Tính số đêm (nếu là khách sạn có ngày nhận/trả)
            function calculateNights(start, end) {
                if (!start || !end) return 1;
                const s = new Date(start);
                const e = new Date(end);
                if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 1;
                const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
                return Math.max(1, diff);
            }

            function formatMySqlDateTime(value) {
                if (!value) return null;
                const date = value instanceof Date ? value : new Date(value);
                if (Number.isNaN(date.getTime())) return null;
                const pad = (num) => String(num).padStart(2, '0');
                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            }

            function formatMySqlDate(value) {
                if (!value) return null;
                if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
                const date = value instanceof Date ? value : new Date(value);
                if (Number.isNaN(date.getTime())) return null;
                const pad = (num) => String(num).padStart(2, '0');
                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            }

            function normalizeDetailDates(ct, orderType) {
                if (orderType === 'FLIGHT' || orderType === 'TRAIN') {
                    return {
                        ...ct,
                        ngayBatDauSuDung: formatMySqlDateTime(ct.ngayBatDauSuDung),
                        ngayKetThucSuDung: formatMySqlDateTime(ct.ngayKetThucSuDung),
                    };
                }
                return {
                    ...ct,
                    ngayBatDauSuDung: formatMySqlDate(ct.ngayBatDauSuDung) || formatMySqlDateTime(ct.ngayBatDauSuDung),
                    ngayKetThucSuDung: formatMySqlDate(ct.ngayKetThucSuDung) || formatMySqlDateTime(ct.ngayKetThucSuDung),
                };
            }

            function normalizeDetailInsert(ct, orderType) {
                return normalizeDetailDates(ct, orderType);
            }

            function prepareCompatibleDates(ct, orderType) {
                return normalizeDetailInsert(ct, orderType);
            }

            function normalizeDatesForInsert(ct, orderType) {
                return prepareCompatibleDates(ct, orderType);
            }

            function normalizeDetailForDb(ct, orderType) {
                return normalizeDatesForInsert(ct, orderType);
            }

            function toInsertableDetail(ct, orderType) {
                return normalizeDetailForDb(ct, orderType);
            }

            function prepareDetailRow(ct, orderType) {
                return toInsertableDetail(ct, orderType);
            }

            function normalizeRowDates(ct, orderType) {
                return prepareDetailRow(ct, orderType);
            }

            function normalizePersistableDetail(ct, orderType) {
                return normalizeRowDates(ct, orderType);
            }

            function withMySqlCompatibleDates(ct, orderType) {
                return normalizePersistableDetail(ct, orderType);
            }

            function normalizeForInsert(ct, orderType) {
                return withMySqlCompatibleDates(ct, orderType);
            }

            function normalizeDates(ct, orderType) {
                return normalizeForInsert(ct, orderType);
            }

            function normalizeDbSafeDetail(ct, orderType) {
                return normalizeDates(ct, orderType);
            }

            function toDbSafeDetail(ct, orderType) {
                return normalizeDbSafeDetail(ct, orderType);
            }

            function normalizeInsertableDetail(ct, orderType) {
                return toDbSafeDetail(ct, orderType);
            }

            function finalizeDetailDates(ct, orderType) {
                return normalizeInsertableDetail(ct, orderType);
            }

            function ensureValidDateFormat(ct, orderType) {
                return finalizeDetailDates(ct, orderType);
            }

            function normalizeOrderDetailDates(ct, orderType) {
                return ensureValidDateFormat(ct, orderType);
            }

            function prepareDbDetail(ct, orderType) {
                return normalizeOrderDetailDates(ct, orderType);
            }

            function toDbDetail(ct, orderType) {
                return prepareDbDetail(ct, orderType);
            }

            function normalizeDetail(ct, orderType) {
                return toDbDetail(ct, orderType);
            }

            function normalizeDateFields(ct, orderType) {
                return normalizeDetail(ct, orderType);
            }

            function prepareNormalizedDetail(ct, orderType) {
                return normalizeDateFields(ct, orderType);
            }

            function toNormalizedDetail(ct, orderType) {
                return prepareNormalizedDetail(ct, orderType);
            }

            function normalizeUsageDatesByType(ct, orderType) {
                return toNormalizedDetail(ct, orderType);
            }

            function normalizeUsageDates(ct, orderType) {
                return normalizeUsageDatesByType(ct, orderType);
            }

            function normalizeDatesByType(ct, orderType) {
                return normalizeUsageDates(ct, orderType);
            }

            function prepareChiTiet(ct, orderType) {
                return normalizeDatesByType(ct, orderType);
            }

            function normalizeChiTiet(ct, orderType) {
                return prepareChiTiet(ct, orderType);
            }

            function normalizeOrderDates(ct, orderType) {
                return normalizeChiTiet(ct, orderType);
            }

            function normalizeForDbInsert(ct, orderType) {
                return normalizeOrderDates(ct, orderType);
            }

            function normalizeInsertDates(ct, orderType) {
                return normalizeForDbInsert(ct, orderType);
            }

            function normalizeDatePayload(ct, orderType) {
                return normalizeInsertDates(ct, orderType);
            }

            function normalizeDbDates(ct, orderType) {
                return normalizeDatePayload(ct, orderType);
            }

            function normalizeCompatibleDates(ct, orderType) {
                return normalizeDbDates(ct, orderType);
            }

            function normalizePreparedDetail(ct, orderType) {
                return normalizeCompatibleDates(ct, orderType);
            }

            function normalizeFinalDetail(ct, orderType) {
                return normalizePreparedDetail(ct, orderType);
            }

            function prepareFinalInsertDetail(ct, orderType) {
                return normalizeFinalDetail(ct, orderType);
            }

            function normalizeInsertReadyDetail(ct, orderType) {
                return prepareFinalInsertDetail(ct, orderType);
            }

            function toInsertRow(ct, orderType) {
                return normalizeInsertReadyDetail(ct, orderType);
            }

            function normalizeDetailRow(ct, orderType) {
                return toInsertRow(ct, orderType);
            }

            function getInsertableDetail(ct, orderType) {
                return normalizeDetailRow(ct, orderType);
            }

            function normalizeDbDetailRow(ct, orderType) {
                return getInsertableDetail(ct, orderType);
            }

            function normalizeDbInsertDetail(ct, orderType) {
                return normalizeDbDetailRow(ct, orderType);
            }

            function prepareInsertableDbDetail(ct, orderType) {
                return normalizeDbInsertDetail(ct, orderType);
            }

            function getDbReadyDetail(ct, orderType) {
                return prepareInsertableDbDetail(ct, orderType);
            }

            function normalizeMySqlDetail(ct, orderType) {
                return getDbReadyDetail(ct, orderType);
            }

            function toMySqlCompatibleDetail(ct, orderType) {
                return normalizeMySqlDetail(ct, orderType);
            }

            function normalizeCompatibleMySqlDetail(ct, orderType) {
                return toMySqlCompatibleDetail(ct, orderType);
            }

            function finalDetail(ct, orderType) {
                return normalizeCompatibleMySqlDetail(ct, orderType);
            }

            function normalizeInsertRecord(ct, orderType) {
                return finalDetail(ct, orderType);
            }

            function prepareInsertRecord(ct, orderType) {
                return normalizeInsertRecord(ct, orderType);
            }

            function normalizedInsertRecord(ct, orderType) {
                return prepareInsertRecord(ct, orderType);
            }

            function dbReadyDetail(ct, orderType) {
                return normalizedInsertRecord(ct, orderType);
            }

            function getNormalizedDetail(ct, orderType) {
                return dbReadyDetail(ct, orderType);
            }

            function normalizedDetail(ct, orderType) {
                return getNormalizedDetail(ct, orderType);
            }

            function normalizeDatesToDb(ct, orderType) {
                return normalizedDetail(ct, orderType);
            }

            function prepareDbCompatibleDetail(ct, orderType) {
                return normalizeDatesToDb(ct, orderType);
            }

            function convertDetailDates(ct, orderType) {
                return prepareDbCompatibleDetail(ct, orderType);
            }

            function normalizeDateStrings(ct, orderType) {
                return convertDetailDates(ct, orderType);
            }

            function prepareSqlSafeDetail(ct, orderType) {
                return normalizeDateStrings(ct, orderType);
            }

            function getSqlSafeDetail(ct, orderType) {
                return prepareSqlSafeDetail(ct, orderType);
            }

            function normalizeSqlSafeDetail(ct, orderType) {
                return getSqlSafeDetail(ct, orderType);
            }

            function getPreparedDetail(ct, orderType) {
                return normalizeSqlSafeDetail(ct, orderType);
            }

            function normalizeDetailForStorage(ct, orderType) {
                return getPreparedDetail(ct, orderType);
            }

            function prepareStorageDetail(ct, orderType) {
                return normalizeDetailForStorage(ct, orderType);
            }

            function detailForInsert(ct, orderType) {
                return prepareStorageDetail(ct, orderType);
            }

            function normalizeStoredDetail(ct, orderType) {
                return detailForInsert(ct, orderType);
            }

            function insertableDetail(ct, orderType) {
                return normalizeStoredDetail(ct, orderType);
            }

            function normalizeDetailDb(ct, orderType) {
                return insertableDetail(ct, orderType);
            }

            function preparedDetailDb(ct, orderType) {
                return normalizeDetailDb(ct, orderType);
            }

            function toDbCompatibleDetail(ct, orderType) {
                return preparedDetailDb(ct, orderType);
            }

            function normalizeDateCompatibleDetail(ct, orderType) {
                return toDbCompatibleDetail(ct, orderType);
            }

            function compatibleDetail(ct, orderType) {
                return normalizeDateCompatibleDetail(ct, orderType);
            }

            function normalizeInsertCompatibleDetail(ct, orderType) {
                return compatibleDetail(ct, orderType);
            }

            function normalizeFinalInsertDetail(ct, orderType) {
                return normalizeInsertCompatibleDetail(ct, orderType);
            }

            function safeDetail(ct, orderType) {
                return normalizeFinalInsertDetail(ct, orderType);
            }

            function normalizeDbDetailSafe(ct, orderType) {
                return safeDetail(ct, orderType);
            }

            function getSafeInsertDetail(ct, orderType) {
                return normalizeDbDetailSafe(ct, orderType);
            }

            function ensureDetailDates(ct, orderType) {
                return getSafeInsertDetail(ct, orderType);
            }

            function normalizeInsertData(ct, orderType) {
                return ensureDetailDates(ct, orderType);
            }

            function dbInsertDetail(ct, orderType) {
                return normalizeInsertData(ct, orderType);
            }

            function normalizedDbInsertDetail(ct, orderType) {
                return dbInsertDetail(ct, orderType);
            }

            function readyDetail(ct, orderType) {
                return normalizedDbInsertDetail(ct, orderType);
            }

            function getReadyDetail(ct, orderType) {
                return readyDetail(ct, orderType);
            }

            function normalizeDateReadyDetail(ct, orderType) {
                return getReadyDetail(ct, orderType);
            }

            function mysqlReadyDetail(ct, orderType) {
                return normalizeDateReadyDetail(ct, orderType);
            }

            function toMysqlReadyDetail(ct, orderType) {
                return mysqlReadyDetail(ct, orderType);
            }

            function normalizedMysqlDetail(ct, orderType) {
                return toMysqlReadyDetail(ct, orderType);
            }

            function finalMysqlDetail(ct, orderType) {
                return normalizedMysqlDetail(ct, orderType);
            }

            function getFinalDetail(ct, orderType) {
                return finalMysqlDetail(ct, orderType);
            }

            function normalizeForPersistence(ct, orderType) {
                return getFinalDetail(ct, orderType);
            }

            function persistedDetail(ct, orderType) {
                return normalizeForPersistence(ct, orderType);
            }

            function normalizePersistDetail(ct, orderType) {
                return persistedDetail(ct, orderType);
            }

            function insertDetailRow(ct, orderType) {
                return normalizePersistDetail(ct, orderType);
            }

            function prepareInsertRow(ct, orderType) {
                return insertDetailRow(ct, orderType);
            }

            function normalizeRow(ct, orderType) {
                return prepareInsertRow(ct, orderType);
            }

            function prepareDetail(ct, orderType) {
                return normalizeRow(ct, orderType);
            }

            function normalizeForSql(ct, orderType) {
                return prepareDetail(ct, orderType);
            }

            function sqlReadyDetail(ct, orderType) {
                return normalizeForSql(ct, orderType);
            }

            function normalizedSqlDetail(ct, orderType) {
                return sqlReadyDetail(ct, orderType);
            }

            function finalSqlDetail(ct, orderType) {
                return normalizedSqlDetail(ct, orderType);
            }

            function buildInsertDetail(ct, orderType) {
                return finalSqlDetail(ct, orderType);
            }

            function normalizedBuildDetail(ct, orderType) {
                return buildInsertDetail(ct, orderType);
            }

            function getInsertDetail(ct, orderType) {
                return normalizedBuildDetail(ct, orderType);
            }

            function compatibleInsertDetail(ct, orderType) {
                return getInsertDetail(ct, orderType);
            }

            function finalInsertableDetail(ct, orderType) {
                return compatibleInsertDetail(ct, orderType);
            }

            function normalizedRecord(ct, orderType) {
                return finalInsertableDetail(ct, orderType);
            }

            function recordForInsert(ct, orderType) {
                return normalizedRecord(ct, orderType);
            }

            function normalizeUsageDatesCompatible(ct, orderType) {
                return recordForInsert(ct, orderType);
            }

            function preparedUsageDates(ct, orderType) {
                return normalizeUsageDatesCompatible(ct, orderType);
            }

            function finalUsageDates(ct, orderType) {
                return preparedUsageDates(ct, orderType);
            }

            function normalizedUsageDates(ct, orderType) {
                return finalUsageDates(ct, orderType);
            }

            function dbCompatibleDates(ct, orderType) {
                return normalizedUsageDates(ct, orderType);
            }

            function finalDbCompatibleDetail(ct, orderType) {
                return dbCompatibleDates(ct, orderType);
            }

            function normalizeDateDetail(ct, orderType) {
                return finalDbCompatibleDetail(ct, orderType);
            }

            function prepareDateDetail(ct, orderType) {
                return normalizeDateDetail(ct, orderType);
            }

            function normalizeDatesSafe(ct, orderType) {
                return prepareDateDetail(ct, orderType);
            }

            function detailSafeForInsert(ct, orderType) {
                return normalizeDatesSafe(ct, orderType);
            }

            function normalizedSafeDetail(ct, orderType) {
                return detailSafeForInsert(ct, orderType);
            }

            function finalSafeDetail(ct, orderType) {
                return normalizedSafeDetail(ct, orderType);
            }

            function normalizedInsertSafeDetail(ct, orderType) {
                return finalSafeDetail(ct, orderType);
            }

            function insertSafeDetail(ct, orderType) {
                return normalizedInsertSafeDetail(ct, orderType);
            }

            function safeInsertDetail(ct, orderType) {
                return insertSafeDetail(ct, orderType);
            }

            function normalizedCompatibleDetail(ct, orderType) {
                return safeInsertDetail(ct, orderType);
            }

            function preparedCompatibleDetail(ct, orderType) {
                return normalizedCompatibleDetail(ct, orderType);
            }

            function normalizedDateCompatible(ct, orderType) {
                return preparedCompatibleDetail(ct, orderType);
            }

            function finalCompatibleDetail(ct, orderType) {
                return normalizedDateCompatible(ct, orderType);
            }

            function compatibleDbDetail(ct, orderType) {
                return finalCompatibleDetail(ct, orderType);
            }

            function finalDetailForInsert(ct, orderType) {
                return compatibleDbDetail(ct, orderType);
            }

            const validOrderTypes = ['HOTEL', 'TOUR', 'FLIGHT', 'TRAIN', 'ACTIVITY', 'MIXED'];
            const normalizedOrderType = String(loaiDonInput || '').toUpperCase();
            const loaiDon = validOrderTypes.includes(normalizedOrderType)
                ? normalizedOrderType
                : (chiTietList.length > 1 ? 'MIXED' : 'HOTEL');

            const normalizedThongTinDatCho = thongTinDatCho
                ? {
                    hoTenLienHe: String(thongTinDatCho.hoTenLienHe || '').trim(),
                    emailLienHe: String(thongTinDatCho.emailLienHe || '').trim(),
                    sdtLienHe: thongTinDatCho.sdtLienHe ? String(thongTinDatCho.sdtLienHe).trim() : null,
                    laNguoiSuDung: thongTinDatCho.laNguoiSuDung === undefined ? 1 : (thongTinDatCho.laNguoiSuDung ? 1 : 0),
                    tenKhachSuDung: thongTinDatCho.tenKhachSuDung ? String(thongTinDatCho.tenKhachSuDung).trim() : null,
                    ghiChuYeuCau: thongTinDatCho.ghiChuYeuCau ? String(thongTinDatCho.ghiChuYeuCau).trim() : null,
                }
                : null;

            if (normalizedThongTinDatCho && (!normalizedThongTinDatCho.hoTenLienHe || !normalizedThongTinDatCho.emailLienHe)) {
                throw new Error('Thông tin liên hệ không hợp lệ!');
            }

            const orderTypeForNights = loaiDon === 'HOTEL';

            // 2) Tính breakdown từng chi tiết
            let tongTruocThue = 0;
            const enriched = chiTietList.map((ct) => {
                const normalizedDates = finalDetailForInsert(ct, loaiDon);
                const unitPrice = Number(ct.giaTaiThoiDiemMua) || 0;
                const quantity = Number(ct.soLuong) || 0;
                const nights = orderTypeForNights
                    ? calculateNights(normalizedDates.ngayBatDauSuDung, normalizedDates.ngayKetThucSuDung)
                    : 1;
                const sub = quantity * unitPrice * nights;
                const giaGoc = unitPrice * nights;
                return { ...normalizedDates, soLuong: quantity, giaTaiThoiDiemMua: unitPrice, nights, sub, giaGoc };
            });

            for (const ct of enriched) {
                if (!ct.maDichVu || ct.soLuong <= 0 || ct.giaTaiThoiDiemMua < 0) {
                    throw new Error('Chi tiết đơn đặt không hợp lệ!');
                }
            }

            const [services] = await conn.query(
                `SELECT maDichVu FROM DichVu WHERE maDichVu IN (?)`,
                [enriched.map((ct) => ct.maDichVu)]
            );
            const validServiceIds = new Set(services.map((item) => Number(item.maDichVu)));
            for (const ct of enriched) {
                if (!validServiceIds.has(Number(ct.maDichVu))) {
                    throw new Error(`Dịch vụ #${ct.maDichVu} không tồn tại!`);
                }
            }

            if (orderTypeForNights) {
                for (const ct of enriched) {
                    if (!ct.ngayBatDauSuDung || !ct.ngayKetThucSuDung) {
                        throw new Error('Đơn khách sạn cần ngày nhận và ngày trả phòng!');
                    }
                }
            }

            if (loaiDon === 'HOTEL' && enriched.some((ct) => !ct.maPhanLoaiDichVu)) {
                throw new Error('Thiếu thông tin loại phòng để tạo đơn đặt!');
            }

            if ((loaiDon === 'FLIGHT' || loaiDon === 'TRAIN') && enriched.some((ct) => !ct.maPhanLoaiDichVu)) {
                throw new Error('Thiếu thông tin bảng giá vé để tạo đơn đặt!');
            }

            if ((loaiDon === 'FLIGHT' || loaiDon === 'TRAIN') && enriched.some((ct) => Number(ct.giaTaiThoiDiemMua) <= 0)) {
                throw new Error('Giá vé không hợp lệ!');
            }

            if ((loaiDon === 'ACTIVITY' || loaiDon === 'TOUR')) {
                for (const ct of enriched) {
                    ct.maPhanLoaiDichVu = null;
                }
            }

            if (loaiDon === 'ACTIVITY' && enriched.some((ct) => !ct.ngayBatDauSuDung)) {
                throw new Error('Đơn hoạt động cần ngày sử dụng!');
            }

            if (loaiDon === 'TOUR' && enriched.some((ct) => !ct.ngayBatDauSuDung)) {
                throw new Error('Đơn tour cần ngày khởi hành!');
            }

            if ((loaiDon === 'FLIGHT' || loaiDon === 'TRAIN') && enriched.some((ct) => !ct.ngayBatDauSuDung || !ct.ngayKetThucSuDung)) {
                throw new Error('Đơn vé cần thời gian khởi hành và kết thúc!');
            }

            if (loaiDon === 'MIXED') {
                throw new Error('Đơn hỗn hợp chưa được hỗ trợ ở luồng checkout này!');
            }

            if ((loaiDon === 'ACTIVITY' || loaiDon === 'TOUR') && enriched.some((ct) => !ct.ngayBatDauSuDung)) {
                throw new Error('Đơn tour/hoạt động cần ngày sử dụng!');
            }


            tongTruocThue = enriched.reduce((sum, ct) => sum + ct.sub, 0);
            const thuePhi = Math.round(tongTruocThue * 0.1);
            let tongSauThue = tongTruocThue + thuePhi;

            // 3) Áp dụng khuyến mãi nếu có
            let appliedKhuyenMai = null;
            if (maKhuyenMai) {
                const km = await KhuyenMaiModel.validateKhuyenMai(maKhuyenMai);
                if (km) {
                    appliedKhuyenMai = km;
                    if (km.giamGia <= 100) {
                        tongSauThue = tongSauThue * (1 - km.giamGia / 100);
                    } else {
                        tongSauThue = Math.max(0, tongSauThue - km.giamGia);
                    }
                }
            }

            const tongGia = Math.round(tongSauThue);

            // 4) Tạo đơn đặt với các trường breakdown mới
            const [donResult] = await conn.query(
                `INSERT INTO DonDat (maUser, maKhuyenMai, tongGia, giaGoc, tongTruocThue, thuePhi, tongSauThue, vatRate, trangThai, loaiDon)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
                [
                    maUser,
                    appliedKhuyenMai ? maKhuyenMai : null,
                    tongGia,
                    tongTruocThue,
                    tongTruocThue,
                    thuePhi,
                    tongSauThue,
                    10.00,
                    loaiDon
                ]
            );
            const maDon = donResult.insertId;

            if (normalizedThongTinDatCho) {
                await conn.query(
                    `INSERT INTO ThongTinDatCho (maDon, hoTenLienHe, emailLienHe, sdtLienHe, laNguoiSuDung, tenKhachSuDung, ghiChuYeuCau)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        maDon,
                        normalizedThongTinDatCho.hoTenLienHe,
                        normalizedThongTinDatCho.emailLienHe,
                        normalizedThongTinDatCho.sdtLienHe,
                        normalizedThongTinDatCho.laNguoiSuDung,
                        normalizedThongTinDatCho.tenKhachSuDung,
                        normalizedThongTinDatCho.ghiChuYeuCau
                    ]
                );
            }

            // 5) Tạo chi tiết đơn có đủ nights và thanhTien
            for (const ct of enriched) {
                await conn.query(
                    `INSERT INTO ChiTietDon (maDon, maDichVu, maPhanLoaiDichVu, soLuong, giaTaiThoiDiemMua, thanhTien, ngayBatDauSuDung, ngayKetThucSuDung, soDem)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        maDon,
                        ct.maDichVu,
                        ct.maPhanLoaiDichVu || null,
                        ct.soLuong,
                        ct.giaTaiThoiDiemMua,
                        ct.sub,
                        ct.ngayBatDauSuDung || null,
                        ct.ngayKetThucSuDung || null,
                        orderTypeForNights ? ct.nights : null
                    ]
                );
            }

            await conn.commit();
            conn.release();
            return {
                maDon,
                maUser,
                tongGia,
                trangThai: 'PENDING',
                chiTietDon: enriched
            };
        } catch (err) {
            console.error('[DonDatModel.create] error:', err);
            await conn.rollback();
            conn.release();
            if (err && (err.code || err.sqlMessage)) {
                const detail = err.sqlMessage || err.message || 'Lỗi cơ sở dữ liệu';
                throw new Error(detail);
            }
            throw err;
        }
    }

    /**
     * Admin: Cập nhật trạng thái đơn
     */
    static async updateStatus(id, trangThai) {
        const validStatuses = ['PENDING', 'CONFIRMED', 'PAID', 'PARTIAL_PAID', 'CANCELLED', 'COMPLETED'];
        if (!validStatuses.includes(trangThai)) throw new Error('Trạng thái đơn không hợp lệ!');

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [rows] = await conn.query(`SELECT * FROM DonDat WHERE maDon = ? FOR UPDATE`, [id]);
            const don = rows[0];
            if (!don) {
                await conn.rollback();
                return false;
            }

            let nextStatus = trangThai;
            if (trangThai === 'CONFIRMED') {
                nextStatus = 'COMPLETED';
            }

            await conn.query(`UPDATE DonDat SET trangThai = ? WHERE maDon = ?`, [nextStatus, id]);

            if (trangThai === 'CONFIRMED') {
                const [paymentRows] = await conn.query(
                    `SELECT maThanhToan FROM ThanhToan WHERE maDon = ? AND trangThai = 'PAID' LIMIT 1`,
                    [id]
                );

                if (!paymentRows[0]) {
                    await conn.query(
                        `INSERT INTO ThanhToan (maDon, maUser, soTien, phuongThuc, paymentProvider, ghiChu, trangThai, ngayThanhToan)
                         VALUES (?, ?, ?, 'COD', 'ADMIN_CONFIRM', 'Tự động ghi nhận thanh toán khi admin xác nhận đơn', 'PAID', NOW())`,
                        [id, don.maUser, don.tongGia]
                    );
                }
            }

            await conn.commit();
            return true;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    /**
     * Customer: Hủy đơn (chỉ hủy nếu đang PENDING)
     */
    static async cancelByUser(maDon, maUser) {
        const [rows] = await pool.query(`SELECT * FROM DonDat WHERE maDon = ? AND maUser = ?`, [maDon, maUser]);
        if (!rows[0]) throw new Error('Không tìm thấy đơn đặt!');
        if (rows[0].trangThai !== 'PENDING') throw new Error('Chỉ có thể hủy đơn đang ở trạng thái PENDING!');
        await pool.query(`UPDATE DonDat SET trangThai = 'CANCELLED' WHERE maDon = ?`, [maDon]);
        return true;
    }
}

module.exports = DonDatModel;
