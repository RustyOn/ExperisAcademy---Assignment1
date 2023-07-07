const apiAddress = "https://hickory-quilled-actress.glitch.me/"
let json
apiCall()
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

let bankBalance = 100
let loanBalance = 0
let workBalance = 0
let newLoan = 0
let selectedLaptop = 1
let laptopPrice

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

HideLoan()

UpdateBank()
UpdateWork()
UpdateLoan()

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

function Work(){
    workBalance += 100
    UpdateWork()
}
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
function HideLoan(){
    loanBalanceElement.style.display = "none"
    payLoanButtonElement.style.display = "none"
}

function BuyLaptop(){
    if(laptopPrice > bankBalance)
        return alert("Your balance is not enough")
    
    if(laptopPrice <= bankBalance){
        bankBalance -=laptopPrice
        UpdateBank()
        alert("You are now the owner of a 'new' computer!")
    }
}
function ListLaptops(json){

    for(let i in json){
        let option = document.createElement("option");
        option.text = json[i].title;
        option.value = json[i].id;
        selectMenu.add(option);
    }

}
function SelectLaptop(){
    let index = selectMenu.selectedIndex
    //console.log(selectMenu.options[selectMenu.selectedIndex].value)
    selectedLaptop = selectMenu.options[selectMenu.selectedIndex].value
}
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








