/*
    require是运行时调用，所以可以随处调用
    import是编译时调用，必须放在文件开头引入，目前部分浏览器不支持，所以需哟babel把ES6转为ES5再执行
 */

import React, {Component} from 'react'
import config from './config.json'

import styles from './Greeter.css'

class Greeter extends Component {
    render() {
        return (
            <div className={styles.root}>
                {config.greetText}
                <p>写的不是很完整，只是浅尝辄止啦~~</p>
            </div>
        );
    }
}

export default Greeter


// var config = require('./config.json')

// module.exports = function () {
//     var greet = document.createElement('div')
//     greet.textContent = config.greetText
//     return greet
// }