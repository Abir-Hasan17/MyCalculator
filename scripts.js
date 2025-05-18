class Calculator{
    constructor(){
        this.currOperandEliment = document.getElementById("curr_operand")
        this.prevOperandEliment = document.getElementById("prev_operand")
        this.currOperand = "0"
        this.prevOperand = ""
        this.operation = undefined
        this.shouldResetScreen = false

        this.initEventListeners()
    }

    clear() {
        this.currOperand = "0"
        this.prevOperand = ""
        this.operation = undefined
    }

    delete() {
        if(this.currOperand === "0") return
        if(this.currOperand.length === 0)
            this.currOperand = "0";
        else{
            this.currOperand = this.currOperand.slice(0,-1)
        }
    }

    resetScreen(){
        this.currOperand = ""
        this.shouldResetScreen = false
    }
    appendNumber(number) {
        if (this.shouldResetScreen) {
          this.resetScreen();
        }
    
        if (number === "." && this.currOperand.includes(".")) return
    
        if (this.currOperand === "0" && number !== ".") {
          this.currOperand = number
        } else {
          this.currOperand += number
        }
    }

    chooseOperation(operation) {
        if (this.currOperand === "") return
    
        if (this.prevOperand !== "") {
          this.calculate()
        }
    
        this.operation = operation
        this.prevOperand = this.currOperand
        this.currOperand = ""
    }

    percent() {
        this.currOperand = (Number.parseFloat(this.currOperand) / 100).toString()
    }
    
    calculate() {
        let computation
        const prev = Number.parseFloat(this.prevOperand)
        const current = Number.parseFloat(this.currOperand)
    
        if (isNaN(prev) || isNaN(current)) return
    
        switch (this.operation) {
          case "+":
            computation = prev + current
            break
          case "-":
            computation = prev - current
            break
          case "×":
            computation = prev * current
            break
          case "÷":
            if (current === 0) {
              this.currOperand = "Error"
              this.prevOperand = ""
              this.operation = undefined
              this.shouldResetScreen = true
              return
            }
            computation = prev / current
            break
          default:
            return
        }
    
        this.currOperand = this.formatNumber(computation)
        this.operation = undefined
        this.prevOperand = ""
        this.shouldResetScreen = true
    }

    formatNumber(number) {
        const stringNumber = number.toString()
    
        if (stringNumber.includes(".")) {
          const [integerDigits, decimalDigits] = stringNumber.split(".")
          const limitedDecimal = decimalDigits.slice(0, 8)
          const cleanedDecimal = limitedDecimal.replace(/0+$/, "")
    
          if (cleanedDecimal === "") {
            return integerDigits
          }
    
          return `${integerDigits}.${cleanedDecimal}`
        }
    
        return stringNumber
    }

    updateDisplay() {
        this.currOperandEliment.textContent = this.currOperand
    
        if (this.operation != null) {
          this.prevOperandEliment.textContent = `${this.prevOperand} ${this.operation}`
        } else {
          this.prevOperandEliment.textContent = ""
        }
    }

    initEventListeners(){
        document.querySelectorAll("[data-number]").forEach((button) =>{
            button.addEventListener("click", () =>{
                this.appendNumber(button.getAttribute('data-number'))
                this.updateDisplay()
                console.log('number')
            })
        })

        document.querySelectorAll("[data-operation]").forEach((button) =>{
            button.addEventListener("click", ()=>{
                this.chooseOperation(button.getAttribute('data-operation'))
                this.updateDisplay()
            })
        })

        document.querySelectorAll("[data-action]").forEach((button) => {
            button.addEventListener("click", () => {
              const action = button.getAttribute("data-action")
      
              switch (action) {
                case "clear":
                  this.clear()
                  break
                case "delete":
                  this.delete()
                  break
                case "calculate":
                  this.calculate()
                  break
                case "percent":
                  this.percent()
                  break
              }
      
              this.updateDisplay()
            })
        })

        document.addEventListener("keydown", (event) => {
            if (/^[0-9.]$/.test(event.key)) {
              this.appendNumber(event.key)
            } else if (["+", "-", "*", "/"].includes(event.key)) {
              const operationMap = {
                "+": "+",
                "-": "-",
                "*": "×",
                "/": "÷",
              }
              this.chooseOperation(operationMap[event.key])
            } else if (event.key === "Enter" || event.key === "=") {
              this.calculate()
            } else if (event.key === "Backspace") {
              this.delete()
            } else if (event.key === "Escape") {
              this.clear()
            } else if (event.key === "%") {
              this.percent()
            }
      
            this.updateDisplay()
          })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Calculator()
})