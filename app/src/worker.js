import wasm from './wasm/optimized.wasm';

onmessage = event => {
    WebAssembly.instantiateStreaming(fetch(wasm))
        .then(results => {
            console.log(event.data)
            console.log(results.instance.exports.add(12, 1))

        });
    console.log('got some vent')
}