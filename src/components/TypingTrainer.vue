<script lang="ts" setup>
   
import type { Ref } from 'vue'
import { ref, reactive, watch} from 'vue'
import Timer from './Timer.vue';


    const Words: {done:string;error:string;todo:string} =  reactive({
        done :'',
        error:'',
        todo:''
    })

    interface stats {
        ok:number,
        ko:number,
        mots:number,
    }
    const Stats:stats = reactive({
        ok:0,
        ko:0,
        mots:0
    })
    
    const input: Ref<string> = ref('')
    const setDifficulty: Ref<string> = ref('')
    const isLoading: Ref<boolean> = ref(false)
    const TimerComponent = ref<typeof Timer>()


    let allWords: string[] = [] 
    let wordTab: string[] = []
    let newWord:string = ''

    //Initialise une liste de nom
    function loadData(letters:string = 'arstneio' ) {
        
        isLoading.value = true
       
        const testRegex = new RegExp('\\b['+letters+']+\\b')

        if (allWords.length == 0) {
            fetch('https://random-word-api.herokuapp.com/all') 
            .then((res) => res.json())
            .then((json) => {
                if (json) {
                    allWords = json
                    wordTab = json.filter( (a:string) => testRegex.test(a))
                    console.log('LOADED !')
                    isLoading.value = false 

                    SetWordstodo()
                }   
            })
            .catch((err) => console.log('Erreur : '+ err))
        } else {
           console.log('COMPUTED !')
            wordTab = allWords.filter( (a) => testRegex.test(a))
            isLoading.value = false 
            
            SetWordstodo()
        }

    }
 
    function pickRandomWord(): string {
        if (wordTab.length > -1) {
            const rndInt = Math.floor(Math.random() * wordTab.length) + 1
            return wordTab[rndInt]
        }
        return ''
    }

    function SetWordstodo() {
        console.log('je passe pas la fonction !')
        if (wordTab.length > -1) {
            let newWordsList = ''
            for (let i = 0; i < 5; i++) {
                newWordsList += ' ' + pickRandomWord() 
            }
            Words.todo = newWordsList.trim()
        }
    }

    function removeFirstChar(value:string):string {
        // console.log('je supprimer le premier caractère de : '+value)
        return value.substring(1,value.length)
    }

    // function getDateIntervale(dates) {
    //     console.log(dates)
    // }

    watch(input,() => {
        
        if(input.value == '') return //Ingore la réinitialisation du champ
        if(input.value == Words.todo.charAt(0)) {   

            Stats.ok++
            if (Words.todo.charAt(0) == ' ') Stats.mots++

            //Purge les erreurs
            Words.error = '' 
            
            //Initialisation des lettres validées + contrôle de longueur
            Words.done += input.value
            if (Words.done.length > 5) Words.done = removeFirstChar(Words.done)
           
            //Initialisation de la Todo
            if (!newWord) newWord += ' ' + pickRandomWord()
            Words.todo = removeFirstChar(Words.todo) + newWord.charAt(0)
            newWord = removeFirstChar(newWord)

        } else {
            Stats.ko++ 
          
            if (input.value == ' ') Words.error += '_'
            else Words.error += input.value
            
            if (Words.error.length > 10) Words.error = removeFirstChar(Words.error)
        
        }
        
        input.value = ''
    })

    watch(setDifficulty,() => {
        console.log('je change de difficulté')
        loadData(setDifficulty.value)
    })

    

</script>


<template>
    <div class="todo">
        <h4 style="color: green;">DONE</h4>
        <ul>
            <li style="color: green;">Optimisation de l'API de recherche de Mot + filtrage par regex... </li>
            <li style="color: green;">Proposer une liste de choix de difficulité (=> 5 niveaux) avec rechargement de la base</li>
            <li style="color: green;">Stocker la base en cache pour ne pas la recharger en cas de modification</li>
            <li style="color: green;">Ajout d'une barre de progression + Timer</li>
            <li style="color: green;">Declenchement du timer depuis le parent !</li>
            <li style="color: green;">Mise en place du typescript</li>
        </ul>
        <h4>TODO :</h4>
        <ul>
            <li>Regarder pour la mise en cache des données (plôtut qu'en variable !!)</li>
            <li>Améliorer le CSS</li>           
            <li>Faire un peu de reporting :</li>
            <ul>
                <li style="color: green;" >Lettres /min</li>
                <li style="color: green;">Mots par minutes ! (compter les espaces)</li>
                <li>Graph du nombre de fautes vs nombres de réussite (batons)</li>
                <li>Graph de la vitesse de saisie / min !! (courbe)</li>
            </ul>
        </ul>
    </div>

    <div class="timer">
        <!-- @getDateInterval="getDateIntervale" -->
        <Timer ref="TimerComponent" :duration=2 />
    </div>
    <div class="trainer">
        <div>

            <p v-if="isLoading">Loading . . . </p>
            <p v-else-if="wordTab.length > 0">{{ wordTab.length }} chargés !</p>
            <p>
                <span class="done">{{ Words.done  }}</span>
                <span v-if="Words.error" class="error">{{ Words.error }}</span>
                <span class="">{{ Words.todo }}</span>
            </p>
        </div>
        <div>
            <input type="button" @click="(TimerComponent) ? TimerComponent.startTimer() : ''" value="start">
            <input type="text"  placeholder="saisie ici !" v-model="input">
            <select name="difficulty" id="difficulty" v-model="setDifficulty">
                <option value="arstneio">Niveau 1</option>
                <option value="arstneiogm">Niveau 2</option>
                <option value="arstneiogmbljp">Niveau 3</option>
                <option value="arstneiogmbljpvkhd">Niveau 4</option>
                <option value="a-z">Niveau 5</option>
            </select>
         </div>
    </div>

</template>

<style scoped>
.error  {
    color:red
}

.trainer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.done  {
    color:cyan
}

.todo {
    margin-bottom: 40px;
}
</style>