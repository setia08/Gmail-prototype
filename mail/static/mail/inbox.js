document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector('#compose-form').addEventListener('submit', sent_mail);

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#solo-emails-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


      fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        // Print emails
        emails.forEach(Singlemail => {
          console.log(Singlemail);
          const newemail = document.createElement('div');
          newemail.innerHTML = `
          <table class="table">
          <tbody id='Hello'>
          <tr>
            <th scope="row">${Singlemail.id}</th>
            <td><h6>${Singlemail.recipients}</h6></td>
            <td><h6>${Singlemail.subject}</h6></td>
          </tr>
          </tbody>
          </table>
          `;
          newemail.className=Singlemail.read ? 'read': 'unread';
          newemail.addEventListener('click',function(){view_mail(Singlemail.id)} );
          document.querySelector('#emails-view').append(newemail);
        });
    // ... do something else with emails ...
});
}


function sent_mail(){
  const recipients= document.querySelector('#compose-recipients').value;
  const subject=document.querySelector('#compose-subject').value;
  const body=document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  load_mailbox('sent');
  console.log("h1");
}
  
function view_mail(id){
  console.log('This has been bsj clicked');
  
              fetch(`/emails/${id}`)
                .then(response => response.json())
                .then(email => {
                    // Print email
                    console.log(email);
                    document.querySelector('#solo-emails-view').style.display = 'block';
              document.querySelector('#compose-view').style.display = 'none';
              document.querySelector('#emails-view').style.display = 'none';
                   
              document.querySelector('#solo-emails-view').innerHTML = `
              <h6>Sender:  ${email.sender}</h6>
              <h6>Recipients:  ${email.recipients}</h6>
              <h6>Subject: ${email.subject}</h6>
              <h6>Body:  ${email.body}</h6>`;

                    // ... do something else with email ...
                  if (email.archived==false){
                    console.log('Archive');
                  }
                  else
                  {
                    console.log('Unarchive');
                  }

                    const element = document.createElement('button');
                    element.innerHTML = email.archived ? 'UNARCHIVE': "ARCHIVE";
                    element.className=email.archived?'btn btn-danger':'btn btn-success';
                    element.addEventListener('click', function() {
                      
                        fetch(`/emails/${id}`, {
                          method: 'PUT',
                          body: JSON.stringify({
                              archived: !email.archived
                          })
                        })
                        .then(()=>{load_mailbox('archived')})
                        console.log('This element has been clicked!')
                    });
                    document.querySelector("#solo-emails-view").append(element);

                    const reply_btn = document.createElement('button');
                    reply_btn.innerHTML = 'Reply';
                    reply_btn.className= 'btn btn-primary';
                    reply_btn.addEventListener('click', function() {
                      compose_email()
                      
                    document.querySelector('#compose-recipients').value = email.sender;
                    let subject=email.subject;
                    if(subject.split(" ",1)[0]!='Re:'){
                      subject= "Re:"+ subject;
                    }
                    document.querySelector('#compose-subject').value = subject;
                    document.querySelector('#compose-body').value = `On ${email.timestamp}  ${email.sender} wrote ${email.body}`;
                    ;});
                    document.querySelector("#solo-emails-view").append(reply_btn);

                  });
                }             
