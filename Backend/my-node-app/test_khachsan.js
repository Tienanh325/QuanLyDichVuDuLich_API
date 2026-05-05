const KhachSanModel = require('./models/khachsan.model');

(async () => {
    try {
        console.log('Testing KhachSanModel.getById(1)...');
        const ks = await KhachSanModel.getById(1);
        console.log('Result:', ks);
        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
})();
