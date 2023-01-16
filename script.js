//================================================== Afficher les éléments par défaut===============================================//
let mealsData = [];
// fetch data
async function getData() {
    for (let i = 0; i < 6; i++) {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();
        mealsData = data.meals[0];
        document.querySelector(".container").innerHTML += `	<div class="row mb-3">
			<div class="col-md-4">
				<div class="card">
					<img src="${mealsData.strMealThumb}" class="card-img-top" alt="...">
					<div class="card-body">
						<h5 class="card-title">${mealsData.strMeal}</h5>
						<a href="#" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="modBtn" onclick= "showMoadal(${mealsData.idMeal})">Plus détails</a>
					</div>
				</div>
			</div>`       
    }
}
getData();


//=========================================================== recherche ===============================================================//
let pageSize = 6;
let curPage = 1;
let ListMeal = [];
let searchBtn = document.getElementById("searchBtn");
//event listeners
searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let value = document.getElementById("searchInput").value
    async function getMealList() {
        let resMeal = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
        let dataMeal = await resMeal.json();
        ListMeal = dataMeal.meals;
        pagination();
        document.querySelector('#nextButton').addEventListener('click', nextPage);
        document.querySelector('#prevButton').addEventListener('click', previousPage);
    }
    getMealList();


})
function pagination() {
    document.querySelector(".container").innerHTML = "";
    ListMeal.filter((row, index) => {
        let start = (curPage - 1)*pageSize;
        let end = curPage*pageSize;
        if (index >= start && index < end)
            return true;
    }).forEach(c => {
        document.querySelector(".container").innerHTML +=
            `<div class="row mb-3">
			<div class="col-md-4">
				<div class="card">
					<img src="${c.strMealThumb}" class="card-img-top" alt="...">
					<div class="card-body">
						<h5 class="card-title">${c.strMeal}</h5>
						<a href="#" class="btn btn-sm btn-primary" id="modBtn">Plus détails</a>
					</div>
				</div>
			</div>` ;  
    })
    document.getElementById("searchInput").value = "";
}
function previousPage() {
    if (curPage > 1) curPage--;
    pagination();
}
function nextPage() {
    if ((curPage * pageSize) < ListMeal.length) curPage++;
    pagination();
}


async function showMoadal(id) {
    console.log(id)
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id);
    const data = await response.json();
    console.log(data);
    let modalDetails = document.querySelector("#modalDetails");
    let strIngredient;
    let strMeasure;
    strIngredient = "";
    strMeasure = "";


    for (i = 1; i <= 20; i++) {
        if (
            data.meals[0]["strIngredient" + i] !== null &&
            data.meals[0]["strIngredient" + i].length > 0 &&
            data.meals[0]["strIngredient" + i] != " "
        ) {
            strIngredient += `<li> ${data.meals[0]["strIngredient" + i]}</li>`;
        }
        // display Ingredient1++ ;
        if (
            data.meals[0]["strMeasure" + i] !== null &&
            data.meals[0]["strMeasure" + i].length > 0 &&
            data.meals[0]["strMeasure" + i] != " "
        ) {
            strMeasure += `<li> ${data.meals[0]["strMeasure" + i]} </li>`;
        }
    }

    modalDetails.innerHTML = 
    `<div class="d-flex">
        <div>
            <img src="${data.meals[0].strMealThumb}" class="card-img-top imgDetail img-fluid"
            alt="image" style="width=200px";>
        <iframe width="320" height="200" class="mt-2" src="${data.meals[0].strYoutube.replace(
        "https://www.youtube.com/watch?v=",
        "https://www.youtube.com/embed/")}
        "title="Tips For Using Async/Await in JavaScript" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        
        <div>
            <h3>${data.meals[0].strMeal}</h3>
            <p>${data.meals[0].strCategory}</p>
            <div class="d-flex">
                <ol>${strIngredient}</ol>
                <ol>${strMeasure}</ol>
            </div>
            <p>${data.meals[0].strInstructions}</p>
        </div>

    </div>`
    console.log(strIngredient, strMeasure)
}


//================================================= Pagination =====================================//













