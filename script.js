// Calculator functionality
            class Calculator {
            constructor() {
                this.previousOperandElement = document.querySelector('.previous-operand');
                this.currentOperandElement = document.querySelector('.current-operand');
                this.scientificButtons = document.querySelector('.scientific-buttons');
                this.toggleButton = document.querySelector('.toggle-scientific');
                this.modeIndicator = document.querySelector('.mode-indicator');
                this.isScientificMode = false;
                this.clear();
                this.setupEventListeners();
            }
            
            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.resetScreen = false;
            }
            
            delete() {
                if (this.currentOperand.length === 1) {
                    this.currentOperand = '0';
                } else {
                    this.currentOperand = this.currentOperand.slice(0, -1);
                }
            }
            
            appendNumber(number) {
                if (this.resetScreen) {
                    this.currentOperand = '';
                    this.resetScreen = false;
                }
                
                if (number === '.' && this.currentOperand.includes('.')) return;
                
                if (this.currentOperand === '0' && number !== '.') {
                    this.currentOperand = number;
                } else {
                    this.currentOperand += number;
                }
            }
            
            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                
                if (this.previousOperand !== '') {
                    this.compute();
                }
                
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
            }
            
            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (this.operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '−':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        computation = prev / current;
                        break;
                    case 'mod':
                        computation = prev % current;
                        break;
                    case 'power':
                        computation = Math.pow(prev, current);
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
                this.resetScreen = true;
            }
            
            scientificFunction(func) {
                const current = parseFloat(this.currentOperand);
                
                if (isNaN(current)) return;
                
                let result;
                
                switch (func) {
                    case 'sin':
                        result = Math.sin(current * Math.PI / 180);
                        break;
                    case 'cos':
                        result = Math.cos(current * Math.PI / 180);
                        break;
                    case 'tan':
                        result = Math.tan(current * Math.PI / 180);
                        break;
                    case 'log':
                        result = Math.log10(current);
                        break;
                    case 'ln':
                        result = Math.log(current);
                        break;
                    case 'sqrt':
                        result = Math.sqrt(current);
                        break;
                    case 'square':
                        result = Math.pow(current, 2);
                        break;
                    case 'pi':
                        result = Math.PI;
                        break;
                    case 'e':
                        result = Math.E;
                        break;
                    case 'factorial':
                        result = this.factorial(current);
                        break;
                    case 'exp':
                        result = Math.exp(current);
                        break;
                    case 'abs':
                        result = Math.abs(current);
                        break;
                    default:
                        return;
                }
                
                this.currentOperand = result.toString();
                this.resetScreen = true;
            }
            
            factorial(n) {
                if (n < 0) return NaN;
                if (n === 0 || n === 1) return 1;
                
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            }
            
            toggleScientificMode() {
                this.isScientificMode = !this.isScientificMode;
                this.scientificButtons.classList.toggle('active', this.isScientificMode);
                this.toggleButton.classList.toggle('active', this.isScientificMode);
                this.modeIndicator.textContent = this.isScientificMode ? 'SCIENTIFIC MODE' : 'BASIC MODE';
            }
            
            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                
                let integerDisplay;
                
                if (isNaN(integerDigits)) {
                    integerDisplay = '';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', {
                        maximumFractionDigits: 0
                    });
                }
                
                if (decimalDigits != null) {
                    return `${integerDisplay}.${decimalDigits}`;
                } else {
                    return integerDisplay;
                }
            }
            
            updateDisplay() {
                this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
                
                if (this.operation != null) {
                    this.previousOperandElement.innerText = 
                        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
                } else {
                    this.previousOperandElement.innerText = '';
                }
            }
            
            toggleSign() {
                this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
            }
            
            percentage() {
                this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
            }
            
            clearEntry() {
                this.currentOperand = '0';
            }
            
            createRipple(event) {
                const button = event.currentTarget;
                const circle = document.createElement('span');
                const diameter = Math.max(button.clientWidth, button.clientHeight);
                const radius = diameter / 2;
                
                circle.style.width = circle.style.height = `${diameter}px`;
                circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
                circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
                circle.classList.add('ripple');
                
                const ripple = button.getElementsByClassName('ripple')[0];
                if (ripple) {
                    ripple.remove();
                }
                
                button.appendChild(circle);
            }
            
            setupEventListeners() {
                const buttons = document.querySelectorAll('.button');
                
                buttons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.createRipple(e);
                        
                        // Button press animation
                        button.classList.add('button-press');
                        setTimeout(() => {
                            button.classList.remove('button-press');
                        }, 150);
                        
                        if (button.hasAttribute('data-number')) {
                            this.appendNumber(button.getAttribute('data-number'));
                            this.updateDisplay();
                        } else if (button.hasAttribute('data-action')) {
                            const action = button.getAttribute('data-action');
                            
                            switch (action) {
                                case 'clear':
                                    this.clear();
                                    this.updateDisplay();
                                    break;
                                case 'clear-entry':
                                    this.clearEntry();
                                    this.updateDisplay();
                                    break;
                                case 'toggle-sign':
                                    this.toggleSign();
                                    this.updateDisplay();
                                    break;
                                case 'percentage':
                                    this.percentage();
                                    this.updateDisplay();
                                    break;
                                case 'decimal':
                                    this.appendNumber('.');
                                    this.updateDisplay();
                                    break;
                                case 'add':
                                case 'subtract':
                                case 'multiply':
                                case 'divide':
                                case 'mod':
                                case 'power':
                                    this.chooseOperation(button.innerText);
                                    this.updateDisplay();
                                    break;
                                case 'calculate':
                                    this.compute();
                                    this.updateDisplay();
                                    break;
                                default:
                                    this.scientificFunction(action);
                                    this.updateDisplay();
                                    break;
                            }
                        }
                    });
                });
                
                this.toggleButton.addEventListener('click', () => {
                    this.toggleScientificMode();
                });
                
                document.addEventListener('keydown', (e) => {
                    if (e.key >= '0' && e.key <= '9') {
                        this.appendNumber(e.key);
                        this.updateDisplay();
                    } else if (e.key === '.') {
                        this.appendNumber('.');
                        this.updateDisplay();
                    } else if (e.key === '+' || e.key === '-') {
                        this.chooseOperation(e.key === '+' ? '+' : '−');
                        this.updateDisplay();
                    } else if (e.key === '*') {
                        this.chooseOperation('×');
                        this.updateDisplay();
                    } else if (e.key === '/') {
                        e.preventDefault();
                        this.chooseOperation('÷');
                        this.updateDisplay();
                    } else if (e.key === 'Enter' || e.key === '=') {
                        this.compute();
                        this.updateDisplay();
                    } else if (e.key === 'Escape') {
                        this.clear();
                        this.updateDisplay();
                    } else if (e.key === 'Backspace') {
                        this.delete();
                        this.updateDisplay();
                    } else if (e.key === 's' || e.key === 'S') {
                        this.toggleScientificMode();
                    }
                });
            }
        }
        
    const calculator = new Calculator();
