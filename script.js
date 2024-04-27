function verifyFiles() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (file1 && file2) {
        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = function(e) {
            const workbook1 = XLSX.read(e.target.result, {type: 'binary'});
            reader2.onload = function(e) {
                const workbook2 = XLSX.read(e.target.result, {type: 'binary'});
                compareFiles(workbook1, workbook2);
            };
            reader2.readAsBinaryString(file2);
        };
        reader1.readAsBinaryString(file1);
    } else {
        document.getElementById('results').innerHTML = 'Por favor, carga ambos archivos.';
    }
}

function compareFiles(workbook1, workbook2) {
    const firstSheetName1 = workbook1.SheetNames[0];
    const firstSheetName2 = workbook2.SheetNames[0];

    const data1 = XLSX.utils.sheet_to_json(workbook1.Sheets[firstSheetName1], {header:1});
    const data2 = XLSX.utils.sheet_to_json(workbook2.Sheets[firstSheetName2], {header:1});

    let col1 = data1.map(row => row[0]);
    let col2 = data2.map(row => row[0]);
    let differences = col1.filter(x => !col2.includes(x)).concat(col2.filter(x => !col1.includes(x)));

    let resultsDiv = document.getElementById('results');
    if (differences.length > 0) {
        resultsDiv.innerHTML = 'Diferencias encontradas: ' + differences.join(', ');
    } else {
        resultsDiv.innerHTML = 'No se encontraron diferencias en la primera columna.';
    }
}
