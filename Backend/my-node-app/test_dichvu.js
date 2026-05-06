const { pool } = require('./config/db');

async function testDichVu() {
    try {
        // 1. Kiểm tra kiểu cột trangThai
        console.log('=== 1. KIỂU CỘT trangThai ===');
        const [columns] = await pool.query(`DESCRIBE DichVu`);
        const trangThaiCol = columns.find(c => c.Field === 'trangThai');
        console.log('Column info:', JSON.stringify(trangThaiCol, null, 2));

        // 2. Lấy 1 dịch vụ đầu tiên
        console.log('\n=== 2. DỮ LIỆU HIỆN TẠI ===');
        const [rows] = await pool.query('SELECT maDichVu, ten, trangThai FROM DichVu LIMIT 3');
        rows.forEach(r => {
            console.log(`ID: ${r.maDichVu}, Ten: ${r.ten}, trangThai:`, r.trangThai, '| type:', typeof r.trangThai, '| Buffer?:', Buffer.isBuffer(r.trangThai));
        });

        if (rows.length === 0) {
            console.log('Không có dịch vụ nào trong DB!');
            process.exit(0);
        }

        // 3. Thử cập nhật trangThai = 0 cho dịch vụ đầu tiên
        const testId = rows[0].maDichVu;
        console.log(`\n=== 3. THỬ CẬP NHẬT trangThai = 0 cho ID ${testId} ===`);
        const [updateResult] = await pool.query(
            'UPDATE DichVu SET trangThai = ? WHERE maDichVu = ?',
            [0, testId]
        );
        console.log('Update result:', JSON.stringify(updateResult));

        // 4. Kiểm tra lại sau khi cập nhật
        console.log('\n=== 4. SAU KHI CẬP NHẬT ===');
        const [after] = await pool.query('SELECT maDichVu, ten, trangThai FROM DichVu WHERE maDichVu = ?', [testId]);
        console.log('After update:', after[0]?.trangThai, '| type:', typeof after[0]?.trangThai, '| Buffer?:', Buffer.isBuffer(after[0]?.trangThai));

        // 5. Đặt lại về 1
        console.log('\n=== 5. ĐẶT LẠI trangThai = 1 ===');
        await pool.query('UPDATE DichVu SET trangThai = ? WHERE maDichVu = ?', [1, testId]);
        const [reset] = await pool.query('SELECT maDichVu, ten, trangThai FROM DichVu WHERE maDichVu = ?', [testId]);
        console.log('After reset:', reset[0]?.trangThai, '| type:', typeof reset[0]?.trangThai);

    } catch (error) {
        console.error('ERROR:', error.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

testDichVu();
