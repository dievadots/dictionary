
const main = document.querySelector('main')
const searchForm = document.querySelector('.search')
const searchInput = document.querySelector('.search-input')
const wordNode = document.querySelector('.word')
const wordPronunciation = document.querySelector('.word-pronunciation')
const wordTypes = document.querySelector('.word-types')
const playAudioBtn = document.querySelector('.word-play')
const fontSelect = document.querySelector('.font-select')
const themeBtn = document.querySelector('.theme')

let currentAudios = []
let currentAudio = 0

fontSelect.selectedIndex = 0

const getWordInfo = async (word) => {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    const json = await fetch(url, {
        mode: 'cors',
    })

    const data = await json.json()

    return data
}

const displayWord = (data) => {
    wordNode.textContent = data[0].word
    
    wordTypes.replaceChildren()
    
    if(data[0].phonetics.length > 0) {
        data[0].phonetics.forEach(phon => {
            if(phon.audio) {
                currentAudios.push(phon.audio)
            }
        })

        wordPronunciation.textContent = data[0].phonetics[0].text
    } else {
        wordPronunciation.textContent = '//'

    }


    data[0].meanings.forEach(meaning => {
        const node = document.createElement('div')
        node.classList.add('word-type')

        const headerNode = document.createElement('div')
        headerNode.classList.add('word-type-header')
        node.appendChild(headerNode)

        const wordTypeNode = document.createElement('span')
        wordTypeNode.classList.add('word-type-name')
        wordTypeNode.textContent = meaning.partOfSpeech
        headerNode.appendChild(wordTypeNode)
        
        const hrNode = document.createElement('hr')
        headerNode.appendChild(hrNode)
        
        const wordMeaningHeaderNode = document.createElement('span')
        wordMeaningHeaderNode.classList.add('word-meaning-header')
        wordMeaningHeaderNode.textContent = 'Meaning'
        node.appendChild(wordMeaningHeaderNode)
        
        const wordMeanings = document.createElement('ul')
        wordMeanings.classList.add('word-meanings')
        node.appendChild(wordMeanings)
        
        meaning.definitions.forEach(definition => {
            const defNode = document.createElement('li')
            defNode.textContent = definition.definition
            wordMeanings.appendChild(defNode)
        })

        wordTypes.appendChild(node)
    })


}

const displayError = (word) => {
    alert(`Cannod find the word '${word}'`)
}

(async () => {

    displayWord(await getWordInfo('dictionary'))


    searchForm.addEventListener('submit', async e => {
        e.preventDefault()
        
        const data = await getWordInfo(searchInput.value.toLowerCase())
        
        if(!data[0]) {
            displayError(searchInput.value)
            return
        }

        searchInput.value = ''
        
        currentAudio = 0
        currentAudios = []

        displayWord(data)
    })

    playAudioBtn.addEventListener('click', () => {
        if(currentAudios.length > 0) {
            const audio = new Audio(currentAudios[currentAudio])
            currentAudio += 1
            if(currentAudio >= currentAudios.length) {
                currentAudio = 0
            }
            audio.play()
        }
    })

    fontSelect.addEventListener('input', () =>{
        const font = fontSelect.options[fontSelect.selectedIndex].value

        main.classList.remove('main--font-monospace')
        main.classList.remove('main--font-serif')
        main.classList.remove('main--font-sans-serif')

        main.classList.add('main--font-' + font)
    })

    themeBtn.addEventListener('click', () => {
        themeBtn.classList.toggle('theme--dark')
        main.classList.toggle('main--theme-dark')
    })
})()
