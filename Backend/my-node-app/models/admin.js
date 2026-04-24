const bcrypt = require("bcryptjs");
const { connectDB } = require("../config/db");

const ADMIN_ROLES = new Set(["admin", "quantri", "quantrivien", "administrator"]);

const resourceConfigs = {
    suppliers: {
        table: "NhaCungCap",
        alias: "ncc",
        idColumn: "maNhaCungCap",
        select: "ncc.*",
        from: "NhaCungCap ncc",
        searchColumns: ["ncc.ten", "ncc.email", "ncc.soDienThoai", "ncc.diaChi", "ncc.loai"],
        writableFields: ["ten", "email", "soDienThoai", "diaChi", "loai", "trangThai"],
        requiredFields: ["ten", "email", "loai"],
        filterableFields: {
            trangThai: "ncc.trangThai",
            loai: "ncc.loai"
        },
        defaultSort: "ncc.maNhaCungCap DESC"
    },
    services: {
        table: "DichVu",
        alias: "dv",
        idColumn: "maDichVu",
        select: "dv.*, ncc.ten AS tenNhaCungCap",
        from: "DichVu dv LEFT JOIN NhaCungCap ncc ON ncc.maNhaCungCap = dv.maNhaCungCap",
        searchColumns: ["dv.ten", "dv.moTa", "dv.loaiDichVu", "ncc.ten"],
        writableFields: ["ten", "moTa", "gia", "loaiDichVu", "maNhaCungCap", "trangThai"],
        requiredFields: ["ten", "gia", "loaiDichVu", "maNhaCungCap"],
        filterableFields: {
            trangThai: "dv.trangThai",
            loaiDichVu: "dv.loaiDichVu",
            maNhaCungCap: "dv.maNhaCungCap"
        },
        defaultSort: "dv.maDichVu DESC"
    },
    tours: {
        table: "Tour",
        alias: "t",
        idColumn: "maTour",
        select: "t.*, dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap",
        from: "Tour t LEFT JOIN DichVu dv ON dv.maDichVu = t.maDichVu LEFT JOIN NhaCungCap ncc ON ncc.maNhaCungCap = dv.maNhaCungCap",
        searchColumns: ["t.ten", "t.viTri", "dv.ten", "ncc.ten"],
        writableFields: ["maDichVu", "ten", "viTri", "thoiGian", "gia", "ngayBatDau", "soLuong", "moTa", "danhGia"],
        requiredFields: ["maDichVu", "ten", "gia"],
        filterableFields: {
            maDichVu: "t.maDichVu"
        },
        dateField: "t.ngayBatDau",
        defaultSort: "t.maTour DESC"
    },
    tickets: {
        table: "Ve",
        alias: "v",
        idColumn: "maVe",
        select: "v.*, dv.ten AS tenDichVu, lv.TenLoaiVe",
        from: "Ve v LEFT JOIN DichVu dv ON dv.maDichVu = v.maDichVu LEFT JOIN LoaiVe lv ON lv.LoaiVeID = v.LoaiVeID",
        searchColumns: ["v.TenVe", "v.diemKhoiHanh", "v.diemDen", "dv.ten", "lv.TenLoaiVe"],
        writableFields: ["maDichVu", "diemKhoiHanh", "diemDen", "ngayKhoiHanh", "gia", "soChoTrong", "hang", "LoaiVeID", "TenVe", "danhGia"],
        requiredFields: ["maDichVu", "diemKhoiHanh", "diemDen", "ngayKhoiHanh", "gia"],
        filterableFields: {
            maDichVu: "v.maDichVu",
            LoaiVeID: "v.LoaiVeID"
        },
        dateField: "v.ngayKhoiHanh",
        defaultSort: "v.maVe DESC"
    },
    ticketTypes: {
        table: "LoaiVe",
        alias: "lv",
        idColumn: "LoaiVeID",
        select: "lv.*",
        from: "LoaiVe lv",
        searchColumns: ["lv.TenLoaiVe", "lv.trangThai"],
        writableFields: ["TenLoaiVe", "trangThai"],
        requiredFields: ["TenLoaiVe"],
        filterableFields: {
            trangThai: "lv.trangThai"
        },
        defaultSort: "lv.LoaiVeID DESC"
    },
    hotels: {
        table: "KhachSan",
        alias: "ks",
        idColumn: "maKhachSan",
        select: "ks.*, dv.ten AS tenDichVu, ncc.ten AS tenNhaCungCap",
        from: "KhachSan ks LEFT JOIN DichVu dv ON dv.maDichVu = ks.maDichVu LEFT JOIN NhaCungCap ncc ON ncc.maNhaCungCap = dv.maNhaCungCap",
        searchColumns: ["ks.ten", "ks.viTri", "ks.LoaiPhong", "dv.ten", "ncc.ten"],
        writableFields: ["maDichVu", "ten", "viTri", "danhGia", "gia", "phongTrong", "moTa", "LoaiPhong"],
        requiredFields: ["maDichVu", "ten", "viTri", "gia"],
        filterableFields: {
            maDichVu: "ks.maDichVu",
            LoaiPhong: "ks.LoaiPhong"
        },
        defaultSort: "ks.maKhachSan DESC"
    },
    promotions: {
        table: "KhuyenMai",
        alias: "km",
        idColumn: "maKhuyenMai",
        select: "km.*",
        from: "KhuyenMai km",
        searchColumns: ["km.ten", "km.trangThai"],
        writableFields: ["ten", "giamGia", "ngayBatDau", "ngayKetThuc", "trangThai"],
        requiredFields: ["ten", "giamGia", "ngayBatDau", "ngayKetThuc"],
        filterableFields: {
            trangThai: "km.trangThai"
        },
        dateField: "km.ngayBatDau",
        defaultSort: "km.maKhuyenMai DESC"
    },
    users: {
        table: "NguoiDung",
        alias: "nd",
        idColumn: "maNguoiDung",
        select: "nd.*, tk.tenDangNhap, tk.vaiTro",
        from: "NguoiDung nd LEFT JOIN TaiKhoan tk ON tk.accID = nd.accID",
        searchColumns: ["nd.ten", "nd.email", "nd.sdt", "tk.tenDangNhap"],
        writableFields: ["ten", "sdt", "email", "accID"],
        requiredFields: ["ten", "email"],
        filterableFields: {
            accID: "nd.accID"
        },
        defaultSort: "nd.maNguoiDung DESC"
    },
    accounts: {
        table: "TaiKhoan",
        alias: "tk",
        idColumn: "accID",
        select: "tk.accID, tk.tenDangNhap, tk.vaiTro",
        from: "TaiKhoan tk",
        searchColumns: ["tk.tenDangNhap", "tk.vaiTro"],
        writableFields: ["tenDangNhap", "matKhau", "vaiTro"],
        requiredFields: ["tenDangNhap", "matKhau", "vaiTro"],
        filterableFields: {
            vaiTro: "tk.vaiTro"
        },
        defaultSort: "tk.accID DESC"
    },
    admins: {
        table: "QuanTriVien",
        alias: "qtv",
        idColumn: "maAdmin",
        select: "qtv.*, tk.tenDangNhap, tk.vaiTro",
        from: "QuanTriVien qtv LEFT JOIN TaiKhoan tk ON tk.accID = qtv.accID",
        searchColumns: ["qtv.ten", "qtv.email", "qtv.sdt", "tk.tenDangNhap"],
        writableFields: ["ten", "sdt", "email", "accID"],
        requiredFields: ["ten", "email", "accID"],
        filterableFields: {
            accID: "qtv.accID"
        },
        defaultSort: "qtv.maAdmin DESC"
    },
    orders: {
        table: "DonDat",
        alias: "dd",
        idColumn: "maDon",
        select: "dd.*, nd.ten AS tenNguoiDung, nd.email AS emailNguoiDung, (SELECT COUNT(*) FROM ChiTietDon ct WHERE ct.maDon = dd.maDon) AS soDongChiTiet, (SELECT ISNULL(SUM(ct.soLuong), 0) FROM ChiTietDon ct WHERE ct.maDon = dd.maDon) AS tongSoLuong, COALESCE(tt.trangThai, 'chua-thanh-toan') AS trangThaiThanhToan, COALESCE(tt.phuongThuc, '') AS phuongThucThanhToan",
        from: "DonDat dd LEFT JOIN NguoiDung nd ON nd.maNguoiDung = dd.maNguoiDung OUTER APPLY (SELECT TOP 1 t.trangThai, t.phuongThuc FROM ThanhToan t WHERE t.maDon = dd.maDon ORDER BY t.ngayThanhToan DESC, t.maThanhToan DESC) tt",
        searchColumns: ["CAST(dd.maDon AS NVARCHAR(50))", "nd.ten", "nd.email", "dd.trangThai"],
        writableFields: ["maNguoiDung", "tongGia", "trangThai", "ngayTao"],
        requiredFields: ["maNguoiDung", "tongGia", "trangThai"],
        filterableFields: {
            maNguoiDung: "dd.maNguoiDung",
            trangThai: "dd.trangThai"
        },
        dateField: "dd.ngayTao",
        defaultSort: "dd.maDon DESC"
    },
    orderDetails: {
        table: "ChiTietDon",
        alias: "ct",
        idColumn: "maChiTiet",
        select: "ct.*, dv.ten AS tenDichVu, dv.loaiDichVu",
        from: "ChiTietDon ct LEFT JOIN DichVu dv ON dv.maDichVu = ct.maDichVu",
        searchColumns: ["CAST(ct.maDon AS NVARCHAR(50))", "dv.ten", "dv.loaiDichVu"],
        writableFields: ["maDon", "maDichVu", "soLuong", "gia"],
        requiredFields: ["maDon", "maDichVu", "soLuong", "gia"],
        filterableFields: {
            maDon: "ct.maDon",
            maDichVu: "ct.maDichVu"
        },
        defaultSort: "ct.maChiTiet DESC"
    },
    payments: {
        table: "ThanhToan",
        alias: "tt",
        idColumn: "maThanhToan",
        select: "tt.*, dd.tongGia, nd.ten AS tenNguoiDung, nd.email AS emailNguoiDung",
        from: "ThanhToan tt LEFT JOIN DonDat dd ON dd.maDon = tt.maDon LEFT JOIN NguoiDung nd ON nd.maNguoiDung = dd.maNguoiDung",
        searchColumns: ["CAST(tt.maDon AS NVARCHAR(50))", "tt.phuongThuc", "tt.trangThai", "nd.ten"],
        writableFields: ["maDon", "soTien", "phuongThuc", "trangThai", "ngayThanhToan"],
        requiredFields: ["maDon", "soTien", "phuongThuc", "trangThai"],
        filterableFields: {
            maDon: "tt.maDon",
            trangThai: "tt.trangThai"
        },
        dateField: "tt.ngayThanhToan",
        defaultSort: "tt.maThanhToan DESC"
    },
    reviews: {
        table: "DanhGia",
        alias: "dg",
        idColumn: "maDanhGia",
        select: "dg.*, nd.ten AS tenNguoiDung, dv.ten AS tenDichVu",
        from: "DanhGia dg LEFT JOIN NguoiDung nd ON nd.maNguoiDung = dg.maNguoiDung LEFT JOIN DichVu dv ON dv.maDichVu = dg.maDichVu",
        searchColumns: ["nd.ten", "dv.ten", "dg.binhLuan"],
        writableFields: ["maNguoiDung", "maDichVu", "soSao", "binhLuan", "ngayDanhGia"],
        requiredFields: ["maNguoiDung", "maDichVu", "soSao"],
        filterableFields: {
            maNguoiDung: "dg.maNguoiDung",
            maDichVu: "dg.maDichVu"
        },
        dateField: "dg.ngayDanhGia",
        defaultSort: "dg.maDanhGia DESC"
    }
};

const createError = (status, message, details) => {
    const error = new Error(message);
    error.status = status;
    if (details) {
        error.details = details;
    }
    return error;
};

const hasValue = (value) =>
    value !== undefined &&
    value !== null &&
    !(typeof value === "string" && value.trim() === "");

const normalizeRole = (value) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");

const isAdminRole = (value) => ADMIN_ROLES.has(normalizeRole(value));

const normalizeValue = (value) => {
    if (value === undefined) {
        return undefined;
    }

    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? null : trimmed;
    }

    return value;
};

const parseDateInput = (value, fieldName) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw createError(400, `Invalid date for field '${fieldName}'`);
    }
    return parsed;
};

const sanitizePage = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const sanitizePageSize = (value) => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 10;
    }
    return Math.min(parsed, 100);
};

const toIdValue = (value) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
};

const ensureResourceConfig = (resourceKey) => {
    const config = resourceConfigs[resourceKey];
    if (!config) {
        throw createError(404, "Resource not found");
    }
    return config;
};

const validateRequiredFields = (config, payload) => {
    const missingFields = config.requiredFields.filter((field) => !hasValue(payload[field]));

    if (missingFields.length > 0) {
        throw createError(400, "Missing required fields", { missingFields });
    }
};

const preparePayload = async (resourceKey, payload, { isUpdate = false } = {}) => {
    const config = ensureResourceConfig(resourceKey);
    const prepared = {};

    config.writableFields.forEach((field) => {
        if (!Object.prototype.hasOwnProperty.call(payload, field)) {
            return;
        }

        prepared[field] = normalizeValue(payload[field]);
    });

    if (resourceKey === "accounts") {
        if (!isUpdate && !hasValue(prepared.matKhau)) {
            throw createError(400, "Field 'matKhau' is required");
        }

        if (prepared.matKhau === null) {
            delete prepared.matKhau;
        }

        if (hasValue(prepared.matKhau)) {
            prepared.matKhau = await bcrypt.hash(String(prepared.matKhau), 10);
        }
    }

    if (!isUpdate) {
        validateRequiredFields(config, prepared);
    }

    if (Object.keys(prepared).length === 0) {
        throw createError(400, "No valid fields provided");
    }

    ["ngayBatDau", "ngayKetThuc", "ngayKhoiHanh", "ngayTao", "ngayThanhToan", "ngayDanhGia"].forEach((field) => {
        if (hasValue(prepared[field])) {
            prepared[field] = parseDateInput(prepared[field], field);
        }
    });

    return prepared;
};

const buildWhereClause = (config, query, request) => {
    const conditions = [];

    if (hasValue(query.search)) {
        request.input("search", `%${String(query.search).trim()}%`);
        const searchCondition = config.searchColumns
            .map((column) => `${column} LIKE @search`)
            .join(" OR ");
        conditions.push(`(${searchCondition})`);
    }

    Object.entries(config.filterableFields || {}).forEach(([queryKey, column]) => {
        if (!hasValue(query[queryKey])) {
            return;
        }

        const paramName = `filter_${queryKey}`;
        request.input(paramName, normalizeValue(query[queryKey]));
        conditions.push(`${column} = @${paramName}`);
    });

    if (config.dateField && hasValue(query.fromDate)) {
        const fromDate = parseDateInput(query.fromDate, "fromDate");
        request.input("fromDate", fromDate);
        conditions.push(`${config.dateField} >= @fromDate`);
    }

    if (config.dateField && hasValue(query.toDate)) {
        const toDate = parseDateInput(query.toDate, "toDate");
        request.input("toDate", toDate);
        conditions.push(`${config.dateField} < DATEADD(day, 1, @toDate)`);
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
};

const buildListQuery = (config, whereClause) => `
    SELECT ${config.select}
    FROM ${config.from}
    ${whereClause}
    ORDER BY ${config.defaultSort}
    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

    SELECT COUNT(1) AS total
    FROM ${config.from}
    ${whereClause};
`;

const getPublicAdminProfile = (account) => ({
    accID: account.accID,
    maAdmin: account.maAdmin,
    tenDangNhap: account.tenDangNhap,
    vaiTro: account.vaiTro,
    ten: account.ten || "",
    email: account.email || "",
    sdt: account.sdt || ""
});

const verifyPassword = async (plainText, storedPassword) => {
    if (!hasValue(storedPassword)) {
        return false;
    }

    const normalizedStoredPassword = String(storedPassword);

    if (normalizedStoredPassword.startsWith("$2")) {
        return bcrypt.compare(String(plainText), normalizedStoredPassword);
    }

    return String(plainText) === normalizedStoredPassword;
};

const authenticateAdmin = async ({ tenDangNhap, matKhau }) => {
    if (!hasValue(tenDangNhap) || !hasValue(matKhau)) {
        throw createError(400, "tenDangNhap and matKhau are required");
    }

    const pool = await connectDB();
    const request = pool.request();
    request.input("tenDangNhap", String(tenDangNhap).trim());

    const result = await request.query(`
        SELECT TOP 1
            tk.accID,
            tk.tenDangNhap,
            tk.matKhau,
            tk.vaiTro,
            qtv.maAdmin,
            qtv.ten,
            qtv.email,
            qtv.sdt
        FROM TaiKhoan tk
        LEFT JOIN QuanTriVien qtv ON qtv.accID = tk.accID
        WHERE tk.tenDangNhap = @tenDangNhap
    `);

    const account = result.recordset[0];

    if (!account) {
        throw createError(401, "Invalid username or password");
    }

    const passwordMatched = await verifyPassword(matKhau, account.matKhau);
    const hasAdminAccess = Boolean(account.maAdmin) || isAdminRole(account.vaiTro);

    if (!passwordMatched || !hasAdminAccess) {
        throw createError(401, "Invalid username or password");
    }

    return getPublicAdminProfile(account);
};

const getDashboard = async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
        SELECT
            (SELECT COUNT(*) FROM NhaCungCap) AS totalSuppliers,
            (SELECT COUNT(*) FROM DichVu) AS totalServices,
            (SELECT COUNT(*) FROM Tour) AS totalTours,
            (SELECT COUNT(*) FROM Ve) AS totalTickets,
            (SELECT COUNT(*) FROM KhachSan) AS totalHotels,
            (SELECT COUNT(*) FROM NguoiDung) AS totalUsers,
            (SELECT COUNT(*) FROM DonDat) AS totalOrders,
            (SELECT COUNT(*) FROM ThanhToan) AS totalPayments,
            ISNULL((SELECT SUM(CAST(soTien AS DECIMAL(18, 2))) FROM ThanhToan), 0) AS totalRevenue,
            ISNULL((SELECT SUM(CAST(tongGia AS DECIMAL(18, 2))) FROM DonDat), 0) AS totalOrderValue;

        SELECT TOP 6
            YEAR(ngayThanhToan) AS nam,
            MONTH(ngayThanhToan) AS thang,
            SUM(CAST(soTien AS DECIMAL(18, 2))) AS doanhThu
        FROM ThanhToan
        WHERE ngayThanhToan IS NOT NULL
        GROUP BY YEAR(ngayThanhToan), MONTH(ngayThanhToan)
        ORDER BY nam DESC, thang DESC;

        SELECT TOP 5
            dd.maDon,
            dd.tongGia,
            dd.trangThai,
            dd.ngayTao,
            nd.ten AS tenNguoiDung,
            nd.email AS emailNguoiDung
        FROM DonDat dd
        LEFT JOIN NguoiDung nd ON nd.maNguoiDung = dd.maNguoiDung
        ORDER BY dd.ngayTao DESC, dd.maDon DESC;

        SELECT
            dv.loaiDichVu,
            COUNT(*) AS soLuong
        FROM DichVu dv
        GROUP BY dv.loaiDichVu
        ORDER BY soLuong DESC;
    `);

    return {
        overview: result.recordsets[0]?.[0] || {},
        revenueByMonth: (result.recordsets[1] || []).reverse(),
        latestOrders: result.recordsets[2] || [],
        serviceTypes: result.recordsets[3] || []
    };
};

const getLookups = async () => {
    const pool = await connectDB();
    const result = await pool.request().query(`
        SELECT maNhaCungCap, ten, loai, trangThai FROM NhaCungCap ORDER BY ten;
        SELECT maDichVu, ten, loaiDichVu, maNhaCungCap, trangThai FROM DichVu ORDER BY ten;
        SELECT LoaiVeID, TenLoaiVe, trangThai FROM LoaiVe ORDER BY TenLoaiVe;
        SELECT maNguoiDung, ten, email FROM NguoiDung ORDER BY ten;
        SELECT accID, tenDangNhap, vaiTro FROM TaiKhoan ORDER BY tenDangNhap;
        SELECT maDon, maNguoiDung, tongGia, trangThai FROM DonDat ORDER BY maDon DESC;
    `);

    return {
        suppliers: result.recordsets[0] || [],
        services: result.recordsets[1] || [],
        ticketTypes: result.recordsets[2] || [],
        users: result.recordsets[3] || [],
        accounts: result.recordsets[4] || [],
        orders: result.recordsets[5] || []
    };
};

const listResource = async (resourceKey, query = {}) => {
    const config = ensureResourceConfig(resourceKey);
    const pool = await connectDB();
    const request = pool.request();
    const page = sanitizePage(query.page);
    const pageSize = sanitizePageSize(query.pageSize);
    const offset = (page - 1) * pageSize;

    request.input("offset", offset);
    request.input("pageSize", pageSize);

    const whereClause = buildWhereClause(config, query, request);
    const result = await request.query(buildListQuery(config, whereClause));
    const items = result.recordsets[0] || [];
    const total = result.recordsets[1]?.[0]?.total || 0;

    return {
        data: items,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: total === 0 ? 0 : Math.ceil(total / pageSize)
        }
    };
};

const getResourceById = async (resourceKey, id) => {
    const config = ensureResourceConfig(resourceKey);
    const pool = await connectDB();
    const request = pool.request();
    request.input("id", toIdValue(id));

    const result = await request.query(`
        SELECT ${config.select}
        FROM ${config.from}
        WHERE ${config.alias}.${config.idColumn} = @id
    `);

    const item = result.recordset[0];

    if (!item) {
        throw createError(404, "Record not found");
    }

    return item;
};

const createResource = async (resourceKey, payload) => {
    const config = ensureResourceConfig(resourceKey);
    const pool = await connectDB();
    const prepared = await preparePayload(resourceKey, payload);
    const fields = Object.keys(prepared);
    const request = pool.request();

    fields.forEach((field) => {
        request.input(field, prepared[field]);
    });

    const result = await request.query(`
        INSERT INTO ${config.table} (${fields.join(", ")})
        OUTPUT INSERTED.${config.idColumn} AS id
        VALUES (${fields.map((field) => `@${field}`).join(", ")})
    `);

    return getResourceById(resourceKey, result.recordset[0].id);
};

const updateResource = async (resourceKey, id, payload) => {
    const config = ensureResourceConfig(resourceKey);
    const pool = await connectDB();
    const prepared = await preparePayload(resourceKey, payload, { isUpdate: true });
    const fields = Object.keys(prepared);
    const request = pool.request();
    request.input("id", toIdValue(id));

    fields.forEach((field) => {
        request.input(field, prepared[field]);
    });

    const result = await request.query(`
        UPDATE ${config.table}
        SET ${fields.map((field) => `${field} = @${field}`).join(", ")}
        OUTPUT INSERTED.${config.idColumn} AS id
        WHERE ${config.idColumn} = @id
    `);

    if (!result.recordset[0]) {
        throw createError(404, "Record not found");
    }

    return getResourceById(resourceKey, result.recordset[0].id);
};

const deleteResource = async (resourceKey, id) => {
    const config = ensureResourceConfig(resourceKey);
    const existing = await getResourceById(resourceKey, id);
    const pool = await connectDB();
    const request = pool.request();
    request.input("id", toIdValue(id));

    const result = await request.query(`
        DELETE FROM ${config.table}
        OUTPUT DELETED.${config.idColumn} AS id
        WHERE ${config.idColumn} = @id
    `);

    if (!result.recordset[0]) {
        throw createError(404, "Record not found");
    }

    return existing;
};

const getOrderBundle = async (maDon) => {
    const order = await getResourceById("orders", maDon);
    const pool = await connectDB();
    const request = pool.request();
    request.input("maDon", toIdValue(maDon));

    const result = await request.query(`
        SELECT
            ct.*,
            dv.ten AS tenDichVu,
            dv.loaiDichVu
        FROM ChiTietDon ct
        LEFT JOIN DichVu dv ON dv.maDichVu = ct.maDichVu
        WHERE ct.maDon = @maDon
        ORDER BY ct.maChiTiet ASC;

        SELECT
            tt.*
        FROM ThanhToan tt
        WHERE tt.maDon = @maDon
        ORDER BY tt.ngayThanhToan DESC, tt.maThanhToan DESC;
    `);

    return {
        order,
        details: result.recordsets[0] || [],
        payments: result.recordsets[1] || []
    };
};

module.exports = {
    authenticateAdmin,
    getDashboard,
    getLookups,
    listResource,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
    getOrderBundle,
    resourceConfigs,
    createError
};
