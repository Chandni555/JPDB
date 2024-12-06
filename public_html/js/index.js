
const DB = "student";
const REL = "student-rel";
const TOKEN = "90934404|-31949227214769882|90957255";
const BASEURL = "http://api.login2explore.com:5577";
const GET_ENDPOINT = "/api/irl";
const IML_ENDPOINT = "/api/iml";

function onLoad() {
    document.getElementById("rollNo").focus();
    setBaseUrl(BASEURL);
    resetForm();
}

function resetForm() {
    const formElements = studentForm.elements;
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        element.value = "";
    }

    toggleFields(false);
    document.getElementById("rollNo").disabled = false;
    document.getElementById("rollNo").focus();

    localStorage.removeItem("rec_no");
}

function toggleFields(enable) {
    const fields = ["rollNo","fullName", "class", "birthDate", "address", "enrollmentDate", "update", "save", "reset"];
    fields.forEach(field => document.getElementById(field).disabled = !enable);
}

function checkRollNo() {
    const rollNo = document.getElementById("rollNo").value.trim();
    if (!rollNo) {
        alert("Roll No cannot be empty.");
        return;
    }
    const jsonObj = JSON.stringify({rollNo: rollNo});
    console.log(jsonObj);
    var req = createGET_BY_KEYRequest(TOKEN, DB, REL, jsonObj);
    jQuery.ajaxSetup({async: false});
    var res = executeCommandAtGivenBaseUrl(req, BASEURL, GET_ENDPOINT)
    jQuery.ajaxSetup({async: true});
    console.log(res);
    toggleFields(true);
    if ( res.message === "DATA RETRIEVED FROM PI") {
        const dataObj = JSON.parse(res.data);
        alert("Student already exists, You can update data!");
        localStorage.setItem("rec_no", dataObj.rec_no);
        document.getElementById("fullName").value = dataObj.record.fullName;
        document.getElementById("class").value = dataObj.record.class;
        document.getElementById("birthDate").value = dataObj.record.birthDate;
        document.getElementById("address").value = dataObj.record.address;
        document.getElementById("enrollmentDate").value = dataObj.record.enrollmentDate;

        document.getElementById("rollNo").disabled = true;
        document.getElementById("save").disabled = true;

        document.getElementById("fullName").focus();
        return;
    }
    document.getElementById("update").disabled = true;
    document.getElementById("fullName").focus();
    
}

function saveData() {
    const formData = getFormData();
    console.log(formData);
    if (validateFormData(formData)) {
        const jsonData = JSON.stringify(formData);
        const recNo = localStorage.getItem('rec_no');
        var putReq = createPUTRequest(TOKEN, jsonData, DB, REL);
        jQuery.ajaxSetup({async: false});
        var res = executeCommandAtGivenBaseUrl(putReq, BASEURL, IML_ENDPOINT)
        jQuery.ajaxSetup({async: true});
        console.log(putReq);
        console.log(res);
        if(res.status == 200){
            alert("Data inserted !");
            resetForm();
        }
            
    }
}

function updateData() {
    const formData = getFormData();
    console.log(formData);
    if (validateFormData(formData)) {
        const jsonData = JSON.stringify(formData);
        const recNo = localStorage.getItem('rec_no');
        var updateReq = createUPDATERecordRequest(TOKEN, jsonData, DB, REL, recNo);
        jQuery.ajaxSetup({async: false});
        var res = executeCommandAtGivenBaseUrl(updateReq, BASEURL, IML_ENDPOINT)
        jQuery.ajaxSetup({async: true});
        console.log(updateReq);
        console.log(res);
        alert("Data updated!");
        resetForm();
    }
}

function validateFormData(data) {
    for (const key in data) {
        if (!data[key].trim()) {
            alert(`${key} cannot be empty.`);
            return false;
        }
    }
    return true;
}

function getFormData() {
    return {
        rollNo: document.getElementById("rollNo").value.trim(),
        fullName: document.getElementById("fullName").value.trim(),
        class: document.getElementById("class").value.trim(),
        birthDate: document.getElementById("birthDate").value.trim(),
        address: document.getElementById("address").value.trim(),
        enrollmentDate: document.getElementById("enrollmentDate").value.trim()
    };
}