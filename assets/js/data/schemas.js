function format_examples(data) {
    // `data` is the original data object for the row
    let formatted = '<dl>';
    let fieldName = data.field.substring(1);
    fieldName = fieldName == '' ? '*' : fieldName;
    formatted += '<dt>Examples of <code>SELECT ' + fieldName + ' FROM ' + data.schema + ' LIMIT ' + data.examples.length + ';</code>:</dt>';
    data.examples.forEach((example, i) => {
        formatted += '<dd><pre><code class="language-javascript">' + hljs.highlight(example, {language: 'javascript'}).value + '</code></pre></dd>';
    });
    formatted += '</dl>';
    return formatted;
}


let table = new DataTable('#schema_datatable', {
    ajax: '/assets/json/data/schemas.json',
    columns: [
        { data: 'schema' },
        { 
            data: 'field', 
            className: 'aixcc-filter',
            render: function (data, type, row, meta) {
                if (type === 'display') {
                    if (row.type === 'object' || row.type === 'array' || row.type === '') {
                        return row.childrenExpanded ? '<span class="expandable">▼ </span>' + data : '<span class="expandable">▶ </span>' + data;
                    }
                    return '&nbsp;&nbsp;&nbsp;&nbsp;' + data;
                }
                return data;
            }
        },
        { data: 'type' },
        { data: 'required' },
        { data: 'description' },
    ],
    order: [[0, 'asc'],[1, 'asc']],
    initComplete: function () {
        this.api()
            .columns()
            .every(function () {
                let column = this;
                let title = column.footer().textContent;

                // Create input element
                let input = document.createElement('input');
                input.placeholder = title;
                column.footer().replaceChildren(input);

                // Event listener for user input
                input.addEventListener('keyup', () => {
                    if (column.search() !== this.value) {
                        column.search(input.value).draw();
                    }
                });
            });
    },
    responsive: true,
    paging: false,
    scrollCollapse: true,
    scrollY: '50vh'
});

// Add event listener for opening and closing details
table.on('click', 'tbody span.expandable', function (e) {
    let tr = e.target.closest('tr');
    let row = table.row(tr);

    row.data().childrenExpanded = row.data().childrenExpanded === undefined || !row.data().childrenExpanded;
    let rowName = row.data().field;
    let rowDepth = rowName.split('.').length;

    let datas = table.rows().data();
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        if (data.expanded === undefined) {
            data.expanded = false;
        }
        if (row.data().schema != data.schema) {
            continue;
        }
        if (!row.data().childrenExpanded) {
            if (data.field.startsWith(rowName + '.') && data.field !== row.data().field) {
                data.childrenExpanded = false;
                data.expanded = false;
            }
        } else {
            if (data.field.startsWith(rowName + '.')) {
                data.expanded = data.field.split('.').length == rowDepth + 1;
            }
        }
    }
    table.search.fixed('range', function (searchStr, data, index) {
        return data.expanded || data.field == "";
    });
    table.rows().invalidate();
    table.draw(false);
});

table.on('click', 'tbody td', function (e) {
    let tr = e.target.closest('tr');
    tr.classList.toggle('selected');

    let datas = table.rows('.selected').data();
    let formatted = '';
    for (let i = 0; i < datas.length; i++) {
        if (i > 0) {
            formatted += '<hr>';
        }
        formatted += format_examples(datas[i]);
    }
    $('#selected_schema_examples').html(formatted);
});

$(document).ready(function() {
    table.search.fixed('range', function (searchStr, data, index) {
        return data.field == "";
    });
    table.draw();
});

document.querySelector('#expand_button').addEventListener('click', function () {
    let datas = table.rows().data();
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        data.childrenExpanded = true;
        data.expanded = true;
    }
    table.search.fixed('range', function (searchStr, data, index) {
        return true;
    });
    table.rows().invalidate();
    table.draw();
});