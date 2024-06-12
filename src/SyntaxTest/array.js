async function demo() {
    let a = 5
    return a;
}

async function demo1() {
    let b;
    await demo().then(data => {
        b = data;
    })
    return b;
}

async function demo2() {
    let c = await demo1();
    console.log(c);
}

demo2();