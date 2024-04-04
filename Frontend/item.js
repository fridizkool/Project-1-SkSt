export function addItemToTable(item) {
    let row = document.createElement('tr');
    let id = document.createElement('th');
    let name = document.createElement('td');
    let volume = document.createElement('td');

    let collapse = makeCollapseItem(item);

    id.innerText = item.id;
    name.innerText = item.name;
    volume.innerText = item.volume;

    row.setAttribute('id', "item-row" + item.id);
    row.setAttribute("role", "button");
    row.setAttribute("data-bs-toggle", "collapse");
    row.setAttribute("href", "#item-collapse" + item.id);
    row.setAttribute("aria-expand", "false");
    row.setAttribute("aria-controls", "item-collapse" + item.id);

    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(volume);

    document.getElementById('item-table-body').appendChild(row);
    document.getElementById('item-table-body').appendChild(collapse);

    allItems.push(item);
}

function makeCollapseItem(item) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let wrapper = document.createElement('div');
    let form = document.createElement('form');
    let update = document.createElement('button');
    let del = document.createElement('button');
    let nameIn = document.createElement('input');
    let volumeIn = document.createElement('input');

    wrapper.setAttribute("id", "item-collapse" + item.id);
    wrapper.setAttribute("class", "collapse");

    update.setAttribute("type", 'submit');
    update.setAttribute("class", "btn btn-success")
    update.innerText = `➥`;
    del.setAttribute("type", 'button');
    del.setAttribute("class", "btn btn-danger")
    del.innerText = `╳`;

    del.addEventListener("click", (event) => {
        event.preventDefault();

        fetch(`${URL}/items/delete?id=${item.id}`, {
            method: 'DELETE'
        })
            .then((data) => {
                if (data.status === 200) {
                    let info = document.getElementById("item-row" + item.id);
                    let edit = document.getElementById("item-collapse" + item.id);
                    info.remove();
                    edit.remove();

                    document.getElementById("toast-title").innerText = `Item Deleted`;
                    document.getElementById("toast-info").innerText = `${item.name} Deleted!`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
                else {
                    document.getElementById("toast-title").innerText = "Error deleting";
                    document.getElementById("toast-info").innerText = `Warehouses depend on ${item.name}`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
            })
    });

    nameIn.setAttribute('type', 'text');
    nameIn.setAttribute('value', item.name);
    nameIn = giveNameId(nameIn, `update-item-name-${item.id}`);
    nameIn.setAttribute('class', 'form-control');

    volumeIn.setAttribute('type', 'number');
    volumeIn.setAttribute('value', item.volume);
    volumeIn = giveNameId(volumeIn, `update-item-volume-${item.id}`);
    volumeIn.setAttribute('class', 'form-control');

    form.appendChild(nameIn);
    form.appendChild(br());
    form.appendChild(volumeIn);
    form.appendChild(br());
    form.appendChild(update);
    form.appendChild(del);

    form.setAttribute('id', `update-item-form${item.id}`);
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let input = new FormData(form);

        const id = item.id;
        const volumeFixed = clamp(Number(input.get(`update-item-volume-${id}`)), 0, Number.MAX_VALUE);

        let newWarehouse = {
            id: Number(id),
            name: input.get(`update-item-name-${id}`),
            volume: Number(volumeFixed)
        }

        fetch(`${URL}/warehouses/warehouse/update?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(newWarehouse)
        })
            .then((data) => {
                return data.json();
            })
            .then((itemJson) => {
                console.log(itemJson);
                updateItemInTable(itemJson);
            })
            .catch(error => console.error(error));
    });

    wrapper.appendChild(form);
    tr.setAttribute('id', 'collapsed-item-row' + item.id);
    td.setAttribute('colspan', 7);
    td.appendChild(wrapper);
    tr.append(td);

    return tr;
}

function updateItemInTable(item) {
    if (allItems.find(element => element.name === item.name) === undefined) {
        allItems.push(item.item);
        let datalist = document.getElementById('itemlist');
        const child = document.createElement('option');
        child.setAttribute('value', item.item.name);
        datalist.appendChild(child);

        document.getElementById("toast-title").innerText = "Item Created";
        document.getElementById("toast-info").innerText = `Item ${item.item.name} created!`;
        toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
        toastResponse.show();
    }

    let row = document.getElementById(`item-row${item.id}`);

    let id = document.createElement('th');
    let name = document.createElement('td');
    let volume = document.createElement('td');

    id.innerText = item.id;
    name.innerText = item.name;
    volume.innerText = item.volume;

    row.innerHTML = '';
    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(volume);
}