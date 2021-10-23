// Function to displau the edit form when the user clicks on the edit question button on the front end
// Arguments: all necessary data for rendering the edit form for a specific question
function renderEditForm (quizId, questionId, index) {
    let editArea = document.getElementById(`edit-container-${index}`);
    let editBtn = document.getElementById(`edit-btn-${index}`);
    // Render a form to post the new question data to the DB
    editArea.innerHTML = `<form id="questionForm" action="/quiz/edit-question" method="POST" onsubmit=" return validateQuestion()">` +
        `<input name="quizId" hidden="true" value=${quizId}>` +
        `<input name="questionId" hidden="true" value=${questionId}>` +
        `<input name="question" type="text" placeholder="Question" required="true">` +
        `<input name="optionA" type="text" placeholder="Option A" required="true">` +
        `<input name="optionB" type="text" placeholder="Option B" required="true">` +
        `<input name="optionC" type="text" placeholder="Option C" required="true">` +
        `<input name="optionD" type="text" placeholder="Option D" required="true">` +
        `<input name="correctAnswer" type="text" placeholder="Correct Answer"}>` +

        `<input type="submit" value="Add Question">` +
    `</form>`

    // Display the edit Div
    editArea.hidden = false;
    editArea.display = true;
    
    editBtn.textContent = "Hide Edit Area";

    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        hideEditArea(editArea, editBtn, quizId, questionId, index);
    });
}

// Function to hide the edit area
// Arguments: specific edit area and edit button to target + all necessary data for making the button display the edit area again
function hideEditArea(editArea, editBtn, quizId, questionId, index) {
    editArea.hidden = true;
    editArea.display = false;

    editBtn.textContent = "Edit Question";

    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderEditForm(quizId, questionId, index);
    });
}