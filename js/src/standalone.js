const msgpack = require('msgpack-lite');
const pako = require('pako');
const TFEdit = require('./transferFunctionEditor');
const K3D = require('./core/Core');
const ThreeJsProvider = require('./providers/threejs/provider');

const MsgpackCodec = msgpack.createCodec({ preset: true });

require('katex/dist/katex.min.css');
require('dat.gui/build/dat.gui.css');

function msgpackDecode(data) {
    return msgpack.decode(data, { codec: MsgpackCodec });
}

function CreateK3DAndLoadBinarySnapshot(data, targetDOMNode) {
    let K3DInstance;

    data = pako.inflate(data);
    data = msgpackDecode(data);

    try {
        K3DInstance = new K3D(
            ThreeJsProvider,
            targetDOMNode,
            data.plot,
        );
    } catch (e) {
        console.log(e);
        return null;
    }

    return K3DInstance.setSnapshot(data).then(() => {
        setTimeout(() => {
            if (data.plot.camera.length > 0) {
                K3DInstance.setCamera(data.plot.camera);
                K3DInstance.render();
            }
        }, 10);

        return K3DInstance;
    });
}

module.exports = {
    K3D,
    msgpackDecode,
    CreateK3DAndLoadBinarySnapshot,
    TransferFunctionEditor: TFEdit.transferFunctionEditor,
    TransferFunctionModel: TFEdit.transferFunctionModel,
    TransferFunctionView: TFEdit.transferFunctionView,
    ThreeJsProvider,
    version: require('./version').version,
};
