
let mealsData = [];
// fetch data
async function getData() {
    document.querySelector(".container").innerHTML=""
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
//============================================= Catégories ========================================//
let Catégories = []
// function to get categories
async function getCategories() {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    Catégories = await response.json();
    addCategories(Catégories.categories);
}
getCategories();

// build categorie in html
function addCategories(data) {
    for (let i = 0; i < data.length; i++) {
        let meals = `<option value="${data[i].strCategory}">${data[i].strCategory}</option>`;
        document.querySelector("#category").innerHTML += meals;
    }
}

//==================================================== Régions ===================================//
let contries = []
// function to get countries
async function getCountries() {
    const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    contries = await response.json();
    addCountries(contries.meals);
}
getCountries();
// build countries in html
function addCountries(data) {
    for (let i = 0; i < data.length; i++) {
        let meals = `<option value="${data[i].strArea}">${data[i].strArea}</option>`;
        document.querySelector("#area").innerHTML += meals;
    }
}
//======================================= Filtrer Catégories et régions =========================//
let categoryData, areaData;
let allCategoriesAllArea = [];
document.getElementById("Rechercher").onclick = async function () {
    let category = document.getElementById("category").value;
    let area = document.getElementById("area").value;
    console.log(category);
    console.log(area)

    const response = await fetch
        ("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category);
    categoryData = await response.json();

    const res = await fetch
        ("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + area);
    areaData = await res.json();
    if (area !== "AllRégions" && category == "AllCatégories") {
        let allArea = [];
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + area);
        allArea = await res.json();
        console.log(allArea)
        getData(allArea)
    } else if (area == "AllRégions" && category !== "AllCatégories") {
        let allCategories = [];
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category);
        allCategories = await response.json();
        console.log(allCategories)
        getData(allCategories)
    } else if (category == "AllCatégories" && area == "AllRégions") {
        let AllData = [];
        for (let i = 0; i < Catégories.categories.length; i++) {
            const result = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + Catégories.categories[i].strCategory);
            AllData = await result.json();
            allCategoriesAllArea.push(AllData.meals)
        }
        console.log(allCategoriesAllArea.flat(1))
        getData(allCategoriesAllArea.flat(1))

    } else {
        getData()

    }
}

let areaAndCategoriesId = [];
// and this function for build it
function getDataById() {
    for (let i = 0; i < categoryData.meals.length; i++) {
        for (let j = 0; j < areaData.meals.length; j++) {
            if (categoryData.meals[i].idMeal == areaData.meals[j].idMeal)
            areaAndCategoriesId.push(categoryData.meals[i]);
        }
    }
    getData(areaAndCategoriesId)
}
//============================================== Modale ============================================//
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