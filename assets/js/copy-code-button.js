function createCopyButton(highlightDiv) {
    const button = document.createElement("button");
    button.className = "copy-code-button";
    button.type = "button";
    button.innerText = "Copy";
    button.addEventListener("click", () =>
        copyCodeToClipboard(button, highlightDiv)
    );
    addCopyButtonToDom(button, highlightDiv);
}

async function copyCodeToClipboard(button, highlightDiv) {
    const codeToCopy = highlightDiv.querySelector(":last-child > pre > code")
        .innerText;
    let result;
    try {
        result = await navigator.permissions.query({name: "clipboard-write"});
        if (result.state === "granted" || result.state === "prompt") {
            let codeToCopy_replaced = codeToCopy.trim().replace(/(\n{2})/g, "\n").replace(/(\n{3,})/g, "\n\n");
            console.log(codeToCopy_replaced)
            await navigator.clipboard.writeText(codeToCopy_replaced);
        } else {
            copyCodeBlockExecCommand(codeToCopy, highlightDiv);
        }
    } catch (_) {
        copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    } finally {
        codeWasCopied(button);
    }
}

function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
    const textArea = document.createElement("textArea");
    textArea.contentEditable = "true";
    textArea.readOnly = "false";
    textArea.className = "copyable-text-area";
    textArea.value = codeToCopy;
    highlightDiv.insertBefore(textArea, highlightDiv.firstChild);
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    textArea.setSelectionRange(0, 999999);
    document.execCommand("copy");
    highlightDiv.removeChild(textArea);
}

function codeWasCopied(button) {
    button.blur();
    button.innerText = "Copied!";
    setTimeout(function () {
        button.innerText = "Copy";
    }, 2000);
}

function addCopyButtonToDom(button, highlightDiv) {
    let buttonGroup = document.createElement("div")
    buttonGroup.className = "align-items-center code-buttons d-flex justify-content-end mb-1"
    buttonGroup.appendChild(button)
    highlightDiv.insertBefore(buttonGroup, highlightDiv.firstChild);

    // highlightDiv.insertBefore(button, highlightDiv.firstChild);
    const wrapper = document.createElement("div");
    wrapper.className = "highlight-wrapper";
    highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
    wrapper.appendChild(highlightDiv);
}

document
    .querySelectorAll(".highlight")
    .forEach((highlightDiv) => createCopyButton(highlightDiv));