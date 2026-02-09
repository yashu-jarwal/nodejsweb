async function GstList() {
    fetch("http://localhost:5000/get-Gst-list")
        .then(res => res.json())
        .then(data => console.log("Response:", data))
        .catch(err => console.error("Error:", err));
}
// ---- Function to run SQL Query ----
function getErrorLogs() {
    fetch("http://localhost:5000/get-Error-log-list")
        .then(res => res.json())
        .then(data => console.log("Response:", data))
        .catch(err => console.error("Error:", err));
}

// ---- CLI Argument Execution ----
const fn = process.argv[2];

switch (fn) {
    case "GstList":
        GstList();
        break;

    case "getErrorLogs":
        getErrorLogs();
        break;

    default:
        console.log("Use: node test.js GstList  OR node test.js getErrorLogs");
}



