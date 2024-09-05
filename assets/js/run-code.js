import params from "@params";

function createRunCodeButton(highlightDiv) {
    const button = document.createElement("button");
    button.className = "me-1 run-code-button";
    button.type = "button";
    button.innerText = "Run";
    button.addEventListener("click", () =>
        runCode(button, highlightDiv)
    );
    addCopyButtonToDom(button, highlightDiv);
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

function runCode(button, highlightDiv) {
    document.querySelector("#overlay").style.display = "block"
    let languages = {
        "C": "C",
        "C++14": "CPP14",
        "C++17": "CPP17",
        "Clojure": "CLOJURE",
        "C#": "CSHARP",
        "Golang": "GO",
        "Haskell": "HASKELL",
        "Java 8": "JAVA8",
        "Java": "JAVA14",
        "Javascript": "JAVASCRIPT_NODE",
        "Kotlin": "KOTLIN",
        "Objective C": "OBJECTIVEC",
        "Pascal": "PASCAL",
        "Perl": "PERL",
        "PHP": "PHP",
        "Python 2": "PYTHON",
        "Python": "PYTHON3",
        "Python 3.8": "PYTHON3_8",
        "R": "R",
        "Ruby": "RUBY",
        "Rust": "RUST",
        "Scala": "SCALA",
        "Swift": "SWIFT",
        "TypeScript": "TYPESCRIPT",
    }
    try {
        const codeBox = highlightDiv.querySelector(":last-child > pre > code");
        let lang_set = codeBox.dataset.lang.capitalize()
        let lang = languages[lang_set] || undefined
        let code = codeBox.innerText
        if (undefined !== lang) {
            fetch("https://api.hackerearth.com/v4/partner/code-evaluation/submissions/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "client-secret": params.hackerearth.client_secret
                },
                body: JSON.stringify({
                    'source': code,
                    'lang': lang
                }),

            }).then(res => res.json()).then(data => {
                console.log(data)
                let status_update_url = data.status_update_url
                let timer = setInterval(function () {
                    fetch(status_update_url, {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            "client-secret": params.hackerearth.client_secret
                        }
                    }).then(res => res.json()).then(data => {
                        console.log(data)
                        let tabResult = highlightDiv.closest(".tab-content").parentElement.querySelector(".tab-result")
                        console.log(data.request_status.code)
                        if (data.request_status.code === "CODE_COMPILED") {
                            if (data.result.compile_status !== "OK" && !data.result.compile_status.includes("Compiling")) {
                                clearInterval(timer)
                                console.log(data.result.compile_status)
                                let className = tabResult.className.replace("alert-success", "")
                                tabResult.className = className + " alert-danger"
                                tabResult.style.display = "block"
                                tabResult.innerHTML = data.result.compile_status
                                document.querySelector("#overlay").style.display = ""
                            }
                        }
                        // if("quota" in data.errors){
                        //     clearInterval(timer)
                        // }
                        if (data.request_status.code === "REQUEST_COMPLETED") {
                            clearInterval(timer)
                            let outputUrl = data.result.run_status.output
                            console.log(outputUrl)
                            fetch(outputUrl).then(r => r.text()).then(o => {
                                console.log(o)
                                let className = tabResult.className.replace("alert-danger", "")
                                tabResult.className = className + " alert-success"
                                tabResult.style.display = "block"
                                tabResult.innerHTML = o
                                document.querySelector("#overlay").style.display = ""
                            })
                        }
                    })
                }, 1000)
            })
        } else {
            console.log("Language " + lang + " is not supported.")
        }
    } catch
        (e) {

    } finally {

    }
}

function runCodecodex(button, highlightDiv) {
    let languages = {
        "Java": "java",
        "Python": "py",
        "C++": "cpp",
        "C": "c",
        "Golang": "go",
        "C#": "cs",
        "NodeJS": "js",
    }
    try {
        const codeBox = highlightDiv.querySelector(":last-child > pre > code");
        let lang_set = codeBox.dataset.lang
        let lang = languages[lang_set] || undefined
        let code = codeBox.innerText
        if (undefined !== lang) {
            fetch("https://api.codex.jaagrav.in", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'code': code,
                    'language': lang,
                    // 'input': '7'
                }),

            }).then(res => res.json()).then(data => {
                console.log(data)
            })
        } else {
            console.log("Language " + lang + " is not supported.")
        }

    } catch (e) {

    } finally {

    }

}

function addCopyButtonToDom(button, highlightDiv) {
    let buttonGroups = highlightDiv.querySelector(".code-buttons");
    buttonGroups.insertBefore(button, buttonGroups.firstChild)
}

document
    .querySelectorAll(".highlight")
    .forEach((highlightDiv) => createRunCodeButton(highlightDiv));