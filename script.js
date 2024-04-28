function verifyFiles() {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (!file1 || !file2) {
        document.getElementById('resultsBody').innerHTML = '<tr><td colspan="6">Por favor, carga ambos archivos.</td></tr>';
        return;
    }

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
}

function compareFiles(workbook1, workbook2) {
    const firstSheetName1 = workbook1.SheetNames[0];
    const firstSheetName2 = workbook2.SheetNames[0];

    const sheet1 = workbook1.Sheets[firstSheetName1];
    const sheet2 = workbook2.Sheets[firstSheetName2];

    const data1 = XLSX.utils.sheet_to_json(sheet1, {header:1});
    const data2 = XLSX.utils.sheet_to_json(sheet2, {header:1});

    let resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = ''; // Limpiar los resultados anteriores

    let foundDifferences = false;

    for (let col = 0; col < 4; col++) {
        let col1 = data1.map((row, index) => ({value: row[col] || "", line: index + 1}));
        let col2 = data2.map((row, index) => ({value: row[col] || "", line: index + 1}));

        let onlyInFile1 = col1.filter(x => !col2.some(y => y.value === x.value) && x.value.trim() !== "");
        let onlyInFile2 = col2.filter(x => !col1.some(y => y.value === x.value) && x.value.trim() !== "");

        if (onlyInFile1.length > 0 || onlyInFile2.length > 0) {
            foundDifferences = true;
            onlyInFile1.forEach(item => {
                resultsBody.innerHTML += `<tr><td>${item.value}</td><td>${item.line}</td><td><input type="checkbox"></td><td></td><td></td><td></td></tr>`;
            });
            onlyInFile2.forEach(item => {
                resultsBody.innerHTML += `<tr><td></td><td></td><td></td><td>${item.value}</td><td>${item.line}</td><td><input type="checkbox"></td></tr>`;
            });
        }
    }

    if (!foundDifferences) {
        resultsBody.innerHTML = '<tr><td colspan="6">No se encontraron diferencias.</td></tr>';
    }
}



