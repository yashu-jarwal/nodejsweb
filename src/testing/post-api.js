function getuserlist_filter() {
    fetch("http://localhost:5000/get-user-filter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "paymode": "OTC",
            "bank": "BARB"
        })
    })
        .then(res => res.json())
        .then(data => console.log("Response:", data))
        .catch(err => console.error("Error:", err));
}

function getuserlist_limit() {
    fetch("http://localhost:5000/get-userlist-limit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "Page_Number": "1",
            "Page_Size": "10"
        })
    })
        .then(res => res.json())
        .then(data => console.log("Response:", data))
        .catch(err => console.error("Error:", err));
}



// ---- CLI Argument Execution ----
const fn = process.argv[2];

switch (fn) {
    case "getuserlist_filter":
        getuserlist_filter();
        break;

    case "getuserlist_limit":
        getuserlist_limit();
        break;

    default:
        console.log("Use: node test.js GstList  OR node test.js getErrorLogs");
}