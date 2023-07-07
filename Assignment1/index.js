const apiAddress = "https://hickory-quilled-actress.glitch.me/"
let json
apiCall()
//Fetching the JSON data and utilizing it, almost everything that is related to the laptops themselves
async function apiCall(){
    const response = await fetch(apiAddress + "computers")
    json = await response.json();
    
    ListLaptops(json)
    ShowLaptop(json)
    selectMenu.addEventListener("change", function(){
        laptopSpecs.innerHTML =""
        SelectLaptop()
        ShowLaptop(json)
    })
}
//Variables
let bankBalance = 100
let loanBalance = 0
let workBalance = 0
let newLoan = 0
let selectedLaptop = 1
let laptopPrice

//DOM elements
const selectMenu = document.getElementById("laptop-select")
const laptopDesc = document.getElementById("laptop-desc")
const laptopPic = document.getElementById("laptop-pic")
const laptopSpecs = document.getElementById("laptop-specs")
const laptopPriceElement = document.getElementById("laptop-price")
const laptopButtonElement = document.getElementById("buy-laptop-button")
const laptopNameElement = document.getElementById("laptop-name")

const loanButtonElement = document.getElementById("loan-button")
const loanBalanceElement = document.getElementById("loan-balance")
const payLoanButtonElement = document.getElementById("pay-loan-button")

const workBalanceElement = document.getElementById("work-balance")
const workButtonElement = document.getElementById("work-button")

const bankBalanceElement = document.getElementById("bank-balance")
const bankButtonElement = document.getElementById("bank-button")

//Initial setup
HideLoan()
UpdateBank()
UpdateWork()
UpdateLoan()

//All button events
loanButtonElement.addEventListener("click", function() {
    newLoan = parseInt(prompt("How much would you like to loan?"))
    
    CheckLoan()
});
workButtonElement.addEventListener("click", function() {
    Work()
});
bankButtonElement.addEventListener("click", function() {
    Bank()
});
payLoanButtonElement.addEventListener("click", function() {
    PayLoan()
});
laptopButtonElement.addEventListener("click", function() {
    BuyLaptop()
});

//Checks loan eligibility based on bank balance and displays alerts. Also updates loan and bank balance when needed.
function CheckLoan(){
    
    if(loanBalance != 0){
        alert("You need to pay of your loan before making another one!")
        return
    }
        
    if((bankBalance * 2) >= newLoan){
        loanBalance = newLoan
        UpdateLoan()
        bankBalance = bankBalance + newLoan
        UpdateBank()
        loanBalanceElement.style.display = "block"
        payLoanButtonElement.style.display = "block"
        
    }else{
        alert("Insufficient balance or the input is not numeric")
        return
    }
        
}
//All Update functions update the HTML element and format it to currency
function UpdateLoan(){

    loanBalanceElement.innerHTML = "Remaining loan: " + new Intl.NumberFormat('sv-Se', {style: 'currency', currency: 'SEK'}).format(loanBalance) 
}
function UpdateBank(){
    bankBalanceElement.innerHTML = "Bank balance: " + new Intl.NumberFormat('sv-Se', {style: 'currency', currency: 'SEK'}).format(bankBalance)
}
function UpdateWork(){
    workBalanceElement.innerHTML = new Intl.NumberFormat('sv-Se', {style: 'currency', currency: 'SEK'}).format(workBalance)
}
function UpdateLaptopPrice(){
    laptopPriceElement.innerHTML = new Intl.NumberFormat('sv-Se', {style: 'currency', currency: 'SEK'}).format(laptopPrice)
}
//Adds 100 to work balance and updates it
function Work(){
    workBalance += 100
    UpdateWork()
}
//Calculates and updates bank balances based on work and loan balances.
//Handles 10% loan repayment and transfers the remaining work balance to bank balance.
function Bank(){
    let tempVar = workBalance * 0.1

    if(loanBalance != 0 && tempVar > loanBalance){
        tempVar -= loanBalance
        bankBalance += tempVar
        loanBalance = 0
        UpdateLoan()
    }else if(loanBalance != 0){
        loanBalance -= tempVar
        bankBalance += (workBalance - tempVar)
        UpdateLoan()
    }else{
        bankBalance += workBalance
    }
    workBalance = 0
    UpdateWork()
    UpdateBank() 
}
//Pays off the loan balance using the work balance and updates bank and loan balances.
//Handles cases where workBalance > loanBalance and hides Loan related elements if it reaches 0
function PayLoan(){
    let tempVar = 0
    if(loanBalance == 0)
        return

    if(workBalance > loanBalance){
        tempVar = workBalance - loanBalance
        bankBalance += tempVar
        loanBalance = 0
        UpdateBank()
        UpdateLoan()
    }else{
        loanBalance -= workBalance
        UpdateLoan()
    }
    if(loanBalance == 0)
        HideLoan()
        workBalance = 0
        UpdateWork()
}
//Hides Loan elements
function HideLoan(){
    loanBalanceElement.style.display = "none"
    payLoanButtonElement.style.display = "none"
}
// Handles buying the laptop and cases when laptopPrice > bankBalance
function BuyLaptop(){
    if(laptopPrice > bankBalance)
        return alert("Your balance is not enough")
    
    if(laptopPrice <= bankBalance){
        bankBalance -=laptopPrice
        UpdateBank()
        alert("You are now the owner of a 'new' computer!")
    }
}
//Populates the select element with options containing laptop title and id that is fetched from the json
function ListLaptops(json){

    for(let i in json){
        let option = document.createElement("option");
        option.text = json[i].title;
        option.value = json[i].id;
        selectMenu.add(option);
    }

}
//Handles the laptop selection when the select element changes
function SelectLaptop(){
    let index = selectMenu.selectedIndex
    //console.log(selectMenu.options[selectMenu.selectedIndex].value)
    selectedLaptop = selectMenu.options[selectMenu.selectedIndex].value
}
//Shows information of the laptop that matches the index of the selectedLaptop
//The second for in loop loops through the specs of the laptop and prints them out
function ShowLaptop(json){

    for(let i in json){
        if(json[i].id == selectedLaptop){
            laptopDesc.innerHTML = json[i].description
            laptopNameElement.innerHTML = json[i].title
            laptopPic.src = apiAddress + json[i].image
            laptopPrice = json[i].price
            UpdateLaptopPrice()

            for(let y in json[i].specs){
                laptopSpecs.innerHTML += json[i].specs[y]
                laptopSpecs.innerHTML += "<br>"
            } 
        }
    } 
}








