document.addEventListener('DOMContentLoaded', () => {
    /* 
    Déclaration
    */
        const bodyTag = document.querySelector('body');
        const userToken = window.localStorage.getItem('token');
        const apiKey = '558b63db8d7d46e8934c954fbd98bd3f';
    //

    /* 
    Fonction
    */
        const displayApp = async (page = 'login') => {
            // Faire un fetch sur un fichier HTML
            const response = await fetch(`./components/${page}.html`);

            // Vérifier la requête
            if( response.ok ){
                // Convertir la réponse en texte (car nous attendons du HTML)
                const convertedResponse = await response.text();

                // Ajouter les balises dans le DOM
                bodyTag.innerHTML = convertedResponse;

                // Vérifier le nom de la page à afficher
                switch(page){
                    case 'login':
                        // Capter la soumission du formulaire
                        logSubmit();
                    break;

                    case 'private':
                        // Activer la page privée
                        displayPrivatePage();
                    break;

                    default:
                    break;
                };
            }
            else{
                console.error('Fichier non chargé...');
            };
        };

        const logSubmit = () => {
            const loginForm = document.querySelector('#loginForm');
            const userPass = document.querySelector('[type="password"]');

            loginForm.addEventListener('submit', event => {
                event.preventDefault();

                // Vérifier le mot de passe rentré par l'utilisateur
                if( userPass.value.length >=1 && userPass.value === 'quoideneuf' ){
                    // Charger le fichier private.html dans le DOM
                    displayApp('private');

                    // Créer un cookie dans le localStorage
                    window.localStorage.setItem('token', 'HH9SLeAdQhLa4WicUl7tpyMbq2zlDS');
                }
                else{
                    console.log('User not logged...');
                };
            });
        };

        // Fonction pour cfaire une requête asynchrone
        const asyncFetch = async ( path ) => {
            // Faire une requête fetch()
            const response = await fetch(`https://newsapi.org/v2/${path}apiKey=${apiKey}`);

            // Vérifier le statut de la requête
            if( response.ok ){
                // Convertire la réponse en JSON
                const jsonResponse = await response.json();

                // Vérifier le path
                if( path === 'sources?' ){
                    displaySources(jsonResponse, 'the-next-web')
                }
                else{
                    displayArticles(jsonResponse)
                }

            } else{ console.error('Fetch error detected...') };
        };

        // Function pour afficher les sources dans le DOM
        const displaySources = ( data, firstSource = 'liberation' ) => {
            // Faire une boucle sur le tableau de sources
            for( let item of data.sources ){

                // Vérifier la valeur de item.id
                if( item.id === firstSource ){
                    // Ajouter une option dans le select
                    newsSources.innerHTML += `
                    <option value="${item.id}" selected>${item.name}</option>
                    `;
                }
                else{
                    // Ajouter une option dans le select
                    newsSources.innerHTML += `
                        <option value="${item.id}">${item.name}</option>
                    `;
                };

                // Afficher les articles de firstSource
                asyncFetch(`top-headlines?sources=${firstSource}&`);
            };

            // Capter le changement de source
            getSelectedSource();
        };

        // Fonction pour capter le changement de source
        const getSelectedSource = () => {
            newsSources.addEventListener( 'change', (event) => {
                // Faire une requête sur la source
                asyncFetch(`top-headlines?sources=${event.target.value}&`);
            });
        };

        // Fonction pour afficher les articles dans le DOM
        const displayArticles = (data) => {
            // Vider la liste des articles
            articleList.innerHTML = '';
            
            // Boucle sur la collectionn de données
            for( let item of data.articles ){
                articleList.innerHTML += `
                    <article>
                        <h2>${item.title}</h2>
                        <img src="${ item.urlToImage || 'http://lorempixel.com/200/200' }" alt="${item.title}">
                        <p>${item.description}</p>
                        <a href="${item.url}">See on Website</a>
                    </article>
                `
            }
        };

        // Fonction pour activer la page privée
        const displayPrivatePage = () => {
            const newsSources = document.querySelector('#newsSources');
            const articleList = document.querySelector('#articleList');
            const searchForm = document.querySelector('#searchForm');
            const searchInput = document.querySelector('[placeholder="Rechercher..."]');

            // Charger la liste des sources
            asyncFetch('sources?');

            // Capter la soumission du formulaire
            searchForm.addEventListener('submit', event => {
                // Stopper le comportement par defaut du formulaire
                event.preventDefault();

                // Valider le formulaire si searchInput.value.length >= 5
                if( searchInput.value.length >= 5 ){
                     // Faire une requête sur la source
                    asyncFetch(`everything?q=${searchInput.value}&sortBy=publishedAt&`);
                };
            })
        }
    //
    
    /* 
    Lancer l'interface (IHM)
    */
        // Vérifier le token utilisateur
        if( userToken !== null && userToken === 'HH9SLeAdQhLa4WicUl7tpyMbq2zlDS' ){
            displayApp('private');
        }
        else{
            displayApp('login');
        };
    //
});