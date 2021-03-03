function getRandomInt(min, max) {
    // 不含最大值，含最小值
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random#%E5%BE%97%E5%88%B0%E4%B8%80%E4%B8%AA%E4%B8%A4%E6%95%B0%E4%B9%8B%E9%97%B4%E7%9A%84%E9%9A%8F%E6%9C%BA%E6%95%B4%E6%95%B0
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}



let start_time = undefined;
const problem_set = document.querySelector("#problem-set");

function generate_problems(size) {
    for (let i = 0; i < size; i++) {
        let problem = document.createElement("li");

        let question = `${getRandomInt(-60, 61).toString().padStart(3)}, ${getRandomInt(-60, 61).toString().padStart(3)}`;

        problem.innerHTML = `<label><span>${question}</span><input type="number"></label>`;
        problem_set.appendChild(problem);
    }
}

function check_answers() {
    for (const problem of problem_set.children) {
        let question = problem.innerText.replace(",", "+");
        let answer = problem.querySelector("input").value;
        if (eval(question) == eval(answer)) {
            problem.classList.add("right");
            if (problem.classList.contains("wrong")) {
                problem.classList.remove("wrong");
            }
        }
        else {
            problem.classList.add("wrong");
            if (problem.classList.contains("right")) {
                problem.classList.remove("right");
            }
        }
    }
}

function pause_time() {
    let time = Date.now() - start_time;
    time /= 1000; // ms -> s
    document.querySelector("#time").textContent = time.toFixed(3);
}

generate_problems(24);

document.querySelector("button#start").addEventListener("click", () => { start_time = Date.now(); });

document.querySelector("button#submit").addEventListener("click", check_answers);
document.querySelector("button#submit").addEventListener("click", pause_time);
