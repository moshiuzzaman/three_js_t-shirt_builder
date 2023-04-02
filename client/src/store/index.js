import {proxy} from 'valtio';

const state=proxy({
    intro: true,
    color: '#EFBD48',
    isLogoTexture:true,
    isFullTexture:false,
    logoTexture:'./threejs.png',
    fullTexture:'./threejs.png'
})

export default state