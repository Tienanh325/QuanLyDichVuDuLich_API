const VeModel = require('./models/ve.model');

async function test() {
    try {
        const result = await VeModel.getAll({});
        console.log("Success:", result.data.length);
    } catch(e) {
        console.error("Error VeModel.getAll():", e.message);
    }
    process.exit(0);
}
test();
