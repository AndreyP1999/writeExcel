import express from "express";

import { DoubleMetaphone } from "natural";
import * as ExcelJS from "exceljs";
const app = express();
const encoder = new DoubleMetaphone();
function transliterate(text: string) {
    const map: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g',
        'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k',
        'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
        'я': 'ya',
    };
    if (/[а-яА-Я]/.test(text)) {
        return text.split('').map(char => map[char] || char).join('');
    }
    return text;
}
// Huawei
app.get("/", (req, res) => {
    const filePath = './комп.xlsx';
    const workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(filePath).then(workbook => {
        const worksheet = workbook.getWorksheet(1);
        if (worksheet) {
            worksheet.eachRow((row, rowNumber) => {
                const encoded = encoder.process(transliterate(String(row.values)));
                console.log(`${encoded}: ${row.values}`);
            });
        }
    });
    const query = String(req.query.str);
    const encoded = encoder.process(transliterate('Huawei'));
    res.send(encoded);
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
}); 