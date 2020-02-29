import 'test.js';
//import axios from 'axios';

// Accept HMR as per: https://webpack.js.org/api/hot-module-replacement#accept
if (module.hot) {
    module.hot.accept();
}

//import 'core-js/modules/es.promise';
/*
axios({
    method: 'get',
    url: 'https://jsonplaceholder.typicode.com/users',
}).then(function(response) {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
    response.data.forEach((entry, i) => {
        console.log(entry);
    });
});

console.log('hello');
*/
const foo = () => {
    console.log('foo');
};

foo();
