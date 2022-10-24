import data from "./combined_data.json" assert { type: "json" };
import fs from "fs";

function fetchGeo(sch) {
    const geoURL =
        "https://developers.onemap.sg/commonapi/search?searchVal=" +
        sch.postal_code +
        "&returnGeom=Y&getAddrDetails=Y";

    return new Promise((resolve, reject) => {
        fetch(geoURL)
            .then((resp) => resp.json())
            .then((data) => {
                let result = data.results.filter((rec) => {
                    if (rec.SEARCHVAL === sch.school_name) {
                        return true;
                    } else if (rec.POSTAL === sch.postal_code) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if (result.length === 0) {
                    console.log(sch.school_name, "not found");
                }
                resolve(result[0]);
            });
    });
}

function fetchData() {
    let requests = [];

    data.forEach((sch) => {
        // if (sch.mainlevel_code === "PRIMARY") {
        //     requests.push(fetchGeo(sch));
        // }
        // if (sch.mainlevel_code === "SECONDARY") {
        //     requests.push(fetchGeo(sch));
        // }
        // if (sch.mainlevel_code === "MIXED LEVELS") {
        //     requests.push(fetchGeo(sch));
        // }
        if (sch.mainlevel_code === "JUNIOR COLLEGE") {
            requests.push(fetchGeo(sch));
        }
    });

    Promise.all(requests).then((allData) => {
        const jsonString = JSON.stringify(allData);
        fs.writeFile("./jcGeoData.json", jsonString, (err) => {
            if (err) {
                console.log("Error writing file", err);
            } else {
                console.log("Successfully wrote file");
            }
        });
    });
}

fetchData();
