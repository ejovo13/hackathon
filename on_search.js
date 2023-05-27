const search_fn = () => {

    title = get_title_content();
    sender = get_sender_content();
    email = get_email_content();

    alert(`Search button pressed with\nsender: ${sender}\ntitle: ${title}\nemail: ${email}`);

    // Now let's go ahead and try and select the items according to this criteria
}

const get_input_content = (id) => {
    const input = document.getElementById(id);
    return input.value;
}

const get_title_content = () => {
    return get_input_content("title_input");
}

const get_sender_content = () => {
    return get_input_content("sender_input");
}

const get_email_content = () => {
    return get_input_content("email_input");
}

const myButton = document.getElementById('search_button');
myButton.addEventListener('click', search_fn);

// get_current_tab = () => {
//     const tab = chrome.tabs.query({ active: true, currentWindow: true },
//                       tabs => { return tabs[0] }
//                       )

//     return tab;
// };


// Setting the current
let currentTabId;

const set_current_tab_id = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0];
    currentTabId = tab.id;
    });
};

set_current_tab_id()

const alert_current_tab_id = () => {
    alert(`Current tabid: ${currentTabId}`)
};










// // Get the content of all the emails on the currently loaded page
// const extract_email_text = (tab_id) => {

//     let all_emails

//     alert("WTF")

//     chrome.scripting.executeScript({
//         target: { tabId: tab_id },
//         funcinput: getitle: get_title_content(),
//         sender:
//         {

//             const get_mail_content = () => {
//                 // Get all emails in the inbox
//                 var emails = document.querySelectorAll('.zA');

//                 // Create an array to store the preview texts of the first 10 emails
//                 var previewTexts = [];

//                 // Iterate over the first 10 emails and push their preview text into the array
//                 for (var i = 0; i < emails.length; i++) {
//                     var previewText = emails[i].querySelector('.xS').textContent;
//                     previewTexts.push(previewText);
//                 }

//                 return previewTexts;
//             };

//             return get_mail_content()
//         }
//     }).then((results) => {

//         console.log("WHERE ARE MY FUCKING RESULTS")
//         console.log(results[0].result)

//         // for (const {frameId, result} of injectionResults) {
//             // console.log(`Frame ${frameId} result:`, result);
//         // }

//     });

//     // alert("DONE")
//     // console.log(all_emails)

// };

const execute_script = (options) => {

    chrome.scripting.executeScript({
        target: { tabId: options.tab_id},
        func: (options) => {

            const EMAILS_PER_PAGE = 50

            // =================== Clicking functions ============================
            const click_gmail_button = (button) => {

                const down = new MouseEvent('mousedown');
                const up = new MouseEvent('mouseup');
                button.dispatchEvent(down);
                button.dispatchEvent(up);
            }

            const click_next_button = () => {

                // const btn_id = "T-I J-J5-Ji amD T-I-awG T-I-ax7 T-I-Js-Gs L3"
                const btn_id = ":km";
                const next_button = document.getElementById(btn_id);
                click_gmail_button(next_button)
             };

            const click_prev_button = () => {

                // const btn_id = "T-I J-J5-Ji amD T-I-awG T-I-ax7 T-I-Js-Gs L3"
                const btn_id = ":kl";
                const prev_button = document.getElementById(btn_id);
                click_gmail_button(prev_button)
            }

            const click_first_email = () => {
                var email = document.querySelector('.zA');
                if (email) { email.click(); }
            }

            // ==================== Email inquiry functions ======================================
            // Get all the emails that are on the current page
            const get_emails = (n_emails) => {
                return document.querySelectorAll('.zA');
            }


            const get_mail_content = () => {
                // Get all emails in the inbox
                let emails = get_emails();

                // Create an array to store the preview texts of the first 10 emails
                let previewTexts = [];

                for (var i = 0; i < emails.length; i++) {

                    let j = 0;
                    var previewText = emails[i].querySelector('.afn').textContent;
                    if(previewText.split(',')[0].trim() == "non lue"|| previewText.split(',')[0].trim() == "unread"){
                        j = 1;
                        var lu = false;
                    }
                    else{
                        var lu = true;
                    }
                    var sender = previewText.split(',')[j].trim();
                    var title = previewText.split(',')[j+1].trim();
                    var date = previewText.split(',')[j+2].trim();
                    var text = previewText.split(',')[j+3].trim();

                    let el = {
                        index: i,
                        lu: lu,
                        sender: sender,
                        title: title,
                        date: date,
                        preview: text
                    }
                    previewTexts.push(el);
                }

                return previewTexts;
            };

            const get_email_numbers = () => {
                return parseInt(document.querySelectorAll('.ts')[2].textContent.replace(/\s/g, ""));
            }

            const get_page_numbers = () => {
                return Math.ceil(get_email_numbers() / 50);
            }

            // Given a list of emails with the properties:
            //      index, lu, sender, title, preview
            // go ahead and filter which emails we want to signal for destruction
            const filter_emails = (emails, options) => {

                title_contains = options.title;
                sender = options.sender;
                preview_contains = options.preview;

                pred_list = []

                if (title_contains.length !== 0) {
                    pred_list.push( (email) => {
                        return email.title.includes(title_contains)
                    });
                }

                if (sender.length !== 0) {
                    pred_list.push( (email) => {
                        return email.sender.includes(sender)
                    });
                }

                if (preview_contains.length !== 0) {
                    pred_list.push( (email) => {
                        return email.preview.includes(preview_contains)
                    })
                }

                predicate = (email) => {

                    if (pred_list.length === 0) {
                        return false
                    }

                    let cond = true

                    for (let i = 0; i < pred_list.length; i++) {

                        const func = pred_list[i]
                        cond = cond && func(email)
                    }

                    return cond
                }

                return emails.map(predicate)
            }

            const select_email_boxes = () => {

                emails = get_emails()

                for (let i = 0; i < emails.length; i++) {
                    select_button = emails[i].querySelector('.oZ-jc.T-Jo.J-J5-Ji');
                    if (select_button) {
                        select_button.click();
                    }
                }
            }

            const select_email_boxes_mask = (mask) => {

                emails = get_emails()

                for (let i = 0; i < emails.length; i++) {
                    select_button = emails[i].querySelector('.oZ-jc.T-Jo.J-J5-Ji');
                    if (mask[i]) {
                        select_button.click();
                    }
                }
            }

            const press_delete = () => {

                // const delete_button = document.querySelector('.T-I J-J5-Ji nX T-I-ax7 T-I-Js-Gs mA')
                // if (delete_button) {
                //     delete_button.click()
                // } else {
                //     alert("Delete button not found :(")
                // }

                window.setTimeout(function() {
                    var del_button = document.querySelector('.T-I.J-J5-Ji.nX.T-I-ax7.T-I-Js-Gs.mA');
                    if (del_button) {
                    //   alert("found");
                      var down = new MouseEvent('mousedown');
                      var up = new MouseEvent('mouseup');
                      del_button.dispatchEvent(down);
                      del_button.dispatchEvent(up);
                    }}
                  ,1000);

            }

            // Now that we have a list of emails we want to destroy, we have to go ahead and delete them
            // We need to start from the end
            // const delete_emails = (emails, mask) => {
            async function delete_emails(emails, mask) {

                // How many emails on the last page?
                const remainder = emails.length % EMAILS_PER_PAGE
                const total_pages = get_page_numbers()

                // Now we want to see if any emails on the final page need to be deleted


                // const delete_emails_page = (page_number) => {
                async function delete_emails_page(page_number)  {

                    const starting_index = (page_number - 1) * EMAILS_PER_PAGE;
                    let final_index;

                    if (page_number == total_pages) {
                        final_index = starting_index + remainder
                    } else {
                        final_index = starting_index + EMAILS_PER_PAGE
                    }

                    // Now we need to actually get a list of the email checkboxes
                    mask_slice = mask.slice(starting_index, final_index)

                    console.log(`Treating elements [${starting_index}, ${final_index}]`)

                    // Get the emails on the current page
                    select_email_boxes_mask(mask_slice)
                    press_delete()

                }

                for (let i = total_pages; i > 0; i--) {
                    await delete_emails_page(i)
                    await delay(2000)
                    click_prev_button()
                    await delay(1000)
                }
            }

            function delay(time) {
                return new Promise(resolve => setTimeout(resolve, time));
            }

            async function script_main(options) {

                const page_num = get_page_numbers();
                const total_email = get_email_numbers();
                var all_email_content = get_mail_content();

                for (var i = 1; i < page_num; i++) {
                    click_next_button();
                    await delay(1000);
                    all_email_content = all_email_content.concat(get_mail_content());
                }

                // Make sure that the size of the list is equal to the total number of pages
                console.log(`Length of all_email_content: ${all_email_content.length}`)
                console.log(all_email_content)

                console.log(`Total emails: ${total_email}`)
                console.log(`Total pages: ${page_num}`)

                email_mask = filter_emails(all_email_content, options)

                console.log(email_mask)

                await delete_emails(all_email_content, email_mask)

                sum = 0
                for (let i = 0; i < email_mask.length; i++) {
                    if (email_mask[i]) {
                        sum ++
                    }
                }

                alert(`Total number of emails deleted: ${sum}`)
            }

            script_main(options)


        },
        args: [options]
    });
};

const get_mail_content_popup = () => {

    set_current_tab_id()

    const script_options = {

        title: get_title_content(),
        sender: get_sender_content(),
        preview: get_email_content(),
        tab_id: currentTabId
    }

    execute_script(script_options)

    // alert_current_tab_id()
    // extract_email_text(currentTabId)
    // alert("Done")
};

// // Add a function to be run on the 'test button'
// get_mail_content_tab = () => {

//     alert("Attempting to execute a script in this tab!")

//     chrome.scripting.executeScript({
//         target: {tabId: }
// }

const testButton = document.getElementById('test_button');
// testButton.addEventListener('click', console.log(get_mail_content()))
// testButton.addEventListener('click', () => { console.log(get_mail_content()) } )
// testButton.addEventListener('click', () => { alert(get_current_tab.id ) } )
testButton.addEventListener('click', get_mail_content_popup)