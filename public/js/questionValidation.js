// Function to evaluate if the question which is being submitted has a matching correct answer as a choice
// This is to ensure that future game logic is not broken
function validateQuestion() {
    // Create a regular expression to match an exact string
    let correctAnswer = new RegExp( "^" + document.forms["questionForm"]["correctAnswer"].value + "$")
    let optionA = document.forms["questionForm"]["optionA"].value
    let optionB = document.forms["questionForm"]["optionB"].value
    let optionC = document.forms["questionForm"]["optionC"].value
    let optionD = document.forms["questionForm"]["optionD"].value

    // Submit variable to allow the form to submit or not. Set to false by default
    let submit = false

    // If the submit variable is changed to true - the criteria is met and the question can be added to the DB
    if(correctAnswer.test(optionA) == true){
        submit = true
        return submit;
    };

    if(correctAnswer.test(optionB) == true){
        submit = true
        return submit;
    };

    if(correctAnswer.test(optionC) == true){
        submit = true
        return submit;
    };
    
    if(correctAnswer.test(optionD) == true){
        submit = true
        return submit;
    };

    if(submit == false){
        alert("Please make sure that the correct answer matches a given option")
        return submit;
    };
}