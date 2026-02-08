// Professional Calculator with History and Theme Support
class Calculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.expressionElement = document.querySelector('.expression-display');
        this.scientificButtons = document.querySelector('.scientific-buttons');
        this.toggleButton = document.querySelector('.toggle-scientific');
        this.modeIndicator = document.querySelector('.mode-indicator');
        this.themeToggle = document.querySelector('.theme-toggle');
        this.historyToggle = document.querySelector('.history-toggle');
        this.historyPanel = document.querySelector('.history-panel');
        this.historyList = document.querySelector('.history-list');
        this.historyBadge = document.querySelector('.badge');
        this.clearHistoryBtn = document.querySelector('.clear-history-btn');
        
        this.isScientificMode = false;
        this.history = this.loadHistory();
        this.expression = '';
        this.isDarkTheme = localStorage.getItem('theme') === 'dark';
        
        this.clear();
        this.setupEventListeners();
        this.applyTheme();
        this.updateHistoryDisplay();
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetScreen = false;
        this.expression = '';
    }
    
    delete() {
        if (this.currentOperand.length === 1 || this.currentOperand === '0') {
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
            if (this.currentOperand.length < 15) {
                this.currentOperand += number;
            }
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
        this.expression = `${this.previousOperand} ${operation}`;
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        const fullExpression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
        
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
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
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
        
        // Format result
        computation = this.formatResult(computation);
        
        // Add to history
        this.addToHistory(fullExpression, computation);
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.expression = '';
        this.resetScreen = true;
    }
    
    scientificFunction(func) {
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(current) && func !== 'pi' && func !== 'e' && func !== 'rand') return;
        
        let result;
        let functionName = '';
        
        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                functionName = `sin(${current})`;
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                functionName = `cos(${current})`;
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                functionName = `tan(${current})`;
                break;
            case 'asin':
                if (current < -1 || current > 1) {
                    this.showError('Invalid input for arcsin');
                    return;
                }
                result = Math.asin(current) * 180 / Math.PI;
                functionName = `asin(${current})`;
                break;
            case 'acos':
                if (current < -1 || current > 1) {
                    this.showError('Invalid input for arccos');
                    return;
                }
                result = Math.acos(current) * 180 / Math.PI;
                functionName = `acos(${current})`;
                break;
            case 'atan':
                result = Math.atan(current) * 180 / Math.PI;
                functionName = `atan(${current})`;
                break;
            case 'log':
                if (current <= 0) {
                    this.showError('Invalid input for log');
                    return;
                }
                result = Math.log10(current);
                functionName = `log(${current})`;
                break;
            case 'ln':
                if (current <= 0) {
                    this.showError('Invalid input for ln');
                    return;
                }
                result = Math.log(current);
                functionName = `ln(${current})`;
                break;
            case 'sqrt':
                if (current < 0) {
                    this.showError('Invalid input for sqrt');
                    return;
                }
                result = Math.sqrt(current);
                functionName = `√(${current})`;
                break;
            case 'cbrt':
                result = Math.cbrt(current);
                functionName = `∛(${current})`;
                break;
            case 'square':
                result = Math.pow(current, 2);
                functionName = `${current}²`;
                break;
            case 'cube':
                result = Math.pow(current, 3);
                functionName = `${current}³`;
                break;
            case 'reciprocal':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = 1 / current;
                functionName = `1/${current}`;
                break;
            case 'pi':
                result = Math.PI;
                functionName = 'π';
                break;
            case 'e':
                result = Math.E;
                functionName = 'e';
                break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    this.showError('Factorial requires positive integer');
                    return;
                }
                if (current > 170) {
                    this.showError('Number too large for factorial');
                    return;
                }
                result = this.factorial(current);
                functionName = `${current}!`;
                break;
            case 'exp':
                result = Math.exp(current);
                functionName = `e^${current}`;
                break;
            case 'abs':
                result = Math.abs(current);
                functionName = `|${current}|`;
                break;
            case 'rand':
                result = Math.random();
                functionName = 'rand()';
                break;
            default:
                return;
        }
        
        result = this.formatResult(result);
        this.addToHistory(functionName, result);
        
        this.currentOperand = result.toString();
        this.resetScreen = true;
    }
    
    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    formatResult(num) {
        if (!isFinite(num)) return 'Error';
        
        // Round to avoid floating point errors
        const rounded = Math.round(num * 1e10) / 1e10;
        
        // Convert to string and limit decimal places
        let str = rounded.toString();
        
        // Handle scientific notation for very large/small numbers
        if (Math.abs(rounded) > 1e15 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
            str = rounded.toExponential(6);
        }
        
        return parseFloat(str);
    }
    
    showError(message) {
        const prevOperand = this.previousOperandElement.textContent;
        this.currentOperandElement.textContent = message;
        this.currentOperandElement.classList.add('error');
        
        setTimeout(() => {
            this.currentOperandElement.classList.remove('error');
            this.clear();
            this.updateDisplay();
        }, 2000);
    }
    
    toggleScientificMode() {
        this.isScientificMode = !this.isScientificMode;
        this.scientificButtons.classList.toggle('active', this.isScientificMode);
        this.toggleButton.classList.toggle('active', this.isScientificMode);
        this.modeIndicator.textContent = this.isScientificMode ? 'SCIENTIFIC MODE' : 'BASIC MODE';
    }
    
    getDisplayNumber(number) {
        if (number === '' || number === undefined) return '';
        
        const stringNumber = number.toString();
        
        // Handle scientific notation
        if (stringNumber.includes('e')) {
            return parseFloat(stringNumber).toExponential(6);
        }
        
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
        
        this.expressionElement.innerText = this.expression;
        
        // Add animation
        this.currentOperandElement.classList.add('pulse');
        setTimeout(() => this.currentOperandElement.classList.remove('pulse'), 300);
    }
    
    toggleSign() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }
    
    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }
    
    // History Management
    addToHistory(expression, result) {
        const entry = {
            expression,
            result,
            timestamp: new Date().toLocaleString()
        };
        
        this.history.unshift(entry);
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }
    
    updateHistoryDisplay() {
        this.historyBadge.textContent = this.history.length;
        
        if (this.history.length === 0) {
            this.historyList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-clock-rotate-left"></i>
                    <p>No calculations yet</p>
                </div>
            `;
            return;
        }
        
        this.historyList.innerHTML = this.history.map((entry, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${entry.expression}</div>
                <div class="history-result">= ${entry.result}</div>
                <div class="history-time">${entry.timestamp}</div>
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = item.dataset.index;
                const entry = this.history[index];
                this.currentOperand = entry.result.toString();
                this.updateDisplay();
                this.historyPanel.classList.remove('active');
            });
        });
    }
    
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }
    
    // Theme Management
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
        localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
    
    applyTheme() {
        document.body.classList.toggle('dark-theme', this.isDarkTheme);
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
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
                
                button.classList.add('button-press');
                setTimeout(() => button.classList.remove('button-press'), 150);
                
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
                        case 'backspace':
                            this.delete();
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
        
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        this.historyToggle.addEventListener('click', () => {
            this.historyPanel.classList.toggle('active');
        });
        
        this.clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Clear all history?')) {
                this.clearHistory();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                this.appendNumber(e.key);
                this.updateDisplay();
            } else if (e.key === '.') {
                this.appendNumber('.');
                this.updateDisplay();
            } else if (e.key === '+') {
                this.chooseOperation('+');
                this.updateDisplay();
            } else if (e.key === '-') {
                this.chooseOperation('−');
                this.updateDisplay();
            } else if (e.key === '*') {
                this.chooseOperation('×');
                this.updateDisplay();
            } else if (e.key === '/') {
                e.preventDefault();
                this.chooseOperation('÷');
                this.updateDisplay();
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.compute();
                this.updateDisplay();
            } else if (e.key === 'Escape') {
                this.clear();
                this.updateDisplay();
            } else if (e.key === 'Backspace') {
                this.delete();
                this.updateDisplay();
            }
        });
        
        // Close history panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.historyPanel.contains(e.target) && 
                !this.historyToggle.contains(e.target) &&
                this.historyPanel.classList.contains('active')) {
                this.historyPanel.classList.remove('active');
            }
        });
    }
}

const calculator = new Calculator();