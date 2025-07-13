document.addEventListener('DOMContentLoaded', function() {
    const optionsContainer = document.getElementById('options-container');
    const addOptionBtn = document.getElementById('add-option-btn');
    const optionCount = document.getElementById('option-count');
    const spinBtn = document.getElementById('spin-btn');
    const rouletteWheel = document.getElementById('roulette-wheel');
    const resultSection = document.getElementById('result-section');
    const resultText = document.getElementById('result-text');
    const resetBtn = document.getElementById('reset-btn');
    
    let options = [];
    let colors = [
        'bg-beige-300', 'bg-beige-400', 'bg-beige-500',
        'bg-beige-600', 'bg-beige-300', 'bg-beige-400',
        'bg-beige-500', 'bg-beige-600'
    ];
    
    // Add first option input by default
    addOption();
    
    // Add option button click handler
    addOptionBtn.addEventListener('click', addOption);
    
    // Spin button click handler
    spinBtn.addEventListener('click', spinRoulette);
    
    // Reset button click handler
    resetBtn.addEventListener('click', resetRoulette);
    
    function addOption() {
        if (options.length >= 8) return;
        
        const optionId = Date.now();
        const optionDiv = document.createElement('div');
        optionDiv.className = 'flex items-center';
        optionDiv.innerHTML = `
            <input 
                type="text" 
                id="option-${optionId}" 
                class="option-input flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-beige-500 transition" 
                placeholder="Option ${options.length + 1}" 
                data-id="${optionId}"
            >
            <button 
                class="remove-option-btn px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-r-lg transition"
                data-id="${optionId}"
            >
                <i class="fas fa-times"></i>
            </button>
        `;
        
        optionsContainer.appendChild(optionDiv);
        options.push({ id: optionId, value: '' });
        updateOptionCount();
        
        // Focus the new input
        document.getElementById(`option-${optionId}`).focus();
        
        // Add input event listener
        document.getElementById(`option-${optionId}`).addEventListener('input', function(e) {
            const id = parseInt(e.target.dataset.id);
            const index = options.findIndex(opt => opt.id === id);
            if (index !== -1) {
                options[index].value = e.target.value;
            }
        });
        
        // Add remove button event listener
        document.querySelector(`.remove-option-btn[data-id="${optionId}"]`).addEventListener('click', function(e) {
            const id = parseInt(e.currentTarget.dataset.id);
            removeOption(id);
        });
    }
    
    function removeOption(id) {
        if (options.length <= 1) return;
        
        const index = options.findIndex(opt => opt.id === id);
        if (index !== -1) {
            options.splice(index, 1);
            document.querySelector(`div [data-id="${id}"]`).parentElement.remove();
            updateOptionCount();
        }
    }
    
    function updateOptionCount() {
        optionCount.textContent = options.filter(opt => opt.value.trim() !== '').length;
    }
    
    function spinRoulette() {
        const validOptions = options.filter(opt => opt.value.trim() !== '');
        if (validOptions.length < 2) {
            alert('Veuillez ajouter au moins 2 options valides');
            return;
        }
        
        // Disable spin button during animation
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<i class="fas fa-random mr-2 spinning"></i> En cours...';
        
        // Create wheel segments
        createWheelSegments(validOptions);
        
        // Spin animation
        const spinDegrees = 360 * 5 + Math.floor(Math.random() * 360);
        rouletteWheel.style.transform = `rotate(${spinDegrees}deg)`;
        
        // Calculate result after animation
        setTimeout(() => {
            const segmentAngle = 360 / validOptions.length;
            const normalizedAngle = spinDegrees % 360;
            const winningIndex = Math.floor(((360 - normalizedAngle) % 360) / segmentAngle);
            const winningOption = validOptions[winningIndex].value;
            
            // Show result
            resultText.textContent = winningOption;
            resultSection.classList.remove('hidden');
            
            // Reset spin button
            spinBtn.disabled = false;
            spinBtn.innerHTML = '<i class="fas fa-random mr-2"></i> Faire tourner la roue';
        }, 3000);
    }
    
    function createWheelSegments(validOptions) {
        rouletteWheel.innerHTML = '';
        
        const segmentAngle = 360 / validOptions.length;
        const centerSize = '16%';
        
        validOptions.forEach((option, index) => {
            const segment = document.createElement('div');
            segment.className = `absolute w-1/2 h-1/2 top-0 left-1/2 origin-bottom-left ${colors[index % colors.length]}`;
            segment.style.transform = `rotate(${index * segmentAngle}deg) skewY(${90 - segmentAngle}deg)`;
            segment.style.transformOrigin = '0% 100%';
            segment.dataset.option = option.value;
            
            // Add text label (rotated to be readable)
            const label = document.createElement('div');
            label.className = 'absolute text-white font-medium text-xs md:text-sm w-full text-center';
            label.style.transform = `skewY(${segmentAngle - 90}deg) rotate(${segmentAngle / 2}deg)`;
            label.style.transformOrigin = '0 0';
            label.style.left = '30%';
            label.style.top = '20%';
            label.style.width = '40%';
            label.textContent = option.value.length > 15 ? option.value.substring(0, 12) + '...' : option.value;
            
            segment.appendChild(label);
            rouletteWheel.appendChild(segment);
        });
        
        // Add center circle
        const center = document.createElement('div');
        center.className = 'absolute inset-0 flex items-center justify-center';
        center.innerHTML = `
            <div class="rounded-full bg-white border-4 border-beige-500 flex items-center justify-center" style="width: ${centerSize}; height: ${centerSize};">
                <i class="fas fa-question text-beige-600 text-xl"></i>
            </div>
        `;
        rouletteWheel.appendChild(center);
        
        // Reset rotation for new spin
        rouletteWheel.style.transform = 'rotate(0deg)';
    }
    
    function resetRoulette() {
        resultSection.classList.add('hidden');
        rouletteWheel.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-white border-4 border-beige-500 flex items-center justify-center">
                    <i class="fas fa-question text-beige-600 text-xl"></i>
                </div>
            </div>
        `;
        rouletteWheel.style.transform = 'rotate(0deg)';
    }
});