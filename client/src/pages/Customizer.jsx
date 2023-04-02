import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSnapshot } from 'valtio'
import state from '../store'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { DecalTypes, EditorTabs, FilterTabs } from '../config/constants';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components'
import { reader } from '../config/helpers'
import config from '../config/config'
import { createImage } from '../services/openai'

const Customizer = () => {
    const snap = useSnapshot(state)

    const [file, setFile] = useState('')
    const [prompt, setPrompt] = useState('')
    const [genetatingImg, setGenerationImg] = useState(false)

    const [activeEditorTab, setActiveEditorTab] = useState('')
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        styleshShirt: false
    })

    //show tab content depending on the active Tab
    const genetateTabContent = () => {
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker />
            case "filepicker":
                return <FilePicker
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />
            case "aipicker":
                return <AIPicker
                    prompt={prompt}
                    setPrompt={setPrompt}
                    genetatingImg={genetatingImg}
                    handleSubmit={handleSubmit}
                />
            default:
                return null
        }
    }

    const handleSubmit = async (type) => {
        if (!prompt) return alert("please enter prompt")

        try {
            // call our backent genarate our img
            setGenerationImg(true)
            // const response=await fetch(config.development.backendUrl,{
            //     method:"POST",
            //     headers:{'Content-Type':'application/json'},
            //     body:JSON.stringify({prompt})
            // })
            // if (response.status===500){
            //     alert(response.statusText)
            //     return
            // }

            await createImage()
            const data = await response.json()
            handleDecals(type, `data:image/png;base64,${data.photo}`)
        } catch (error) {
            alert(error)
        } finally {
            setGenerationImg(false)
            setActiveEditorTab('')
        }
    }

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type]
        state[decalType.stateProperty] = result;
        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
    }
    const handleActiveFilterTab = (tabName) => {
        console.log(tabName);
        switch (tabName) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName]
                break;
            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName]
                break;
            default:
                state.isFullTexture = true
                state.isLogoTexture = false
                break;
        }

        // after setting
        setActiveFilterTab(prev => {
            return {
                ...prev,
                [tabName]: !prev[tabName]
            }
        })
    }
    const readFile = (type) => {
        reader(file)
            .then((result) => {
                handleDecals(type, result)
                setActiveEditorTab('')
            })
    }

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div
                        key="custom"
                        className='absolute top-0 left-0 z-10'
                        {...slideAnimation('left')}
                    >

                        <div className='flex items-center min-h-screen'>
                            <div className='editortabs-container tabs'>
                                {EditorTabs.map(tab => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleClick={() => setActiveEditorTab(tab.name)}
                                    />
                                ))}
                                {genetateTabContent()}
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        className='absolute z-10 top-5 right-5'
                        {...slideAnimation('down')}
                    >
                        <CustomButton
                            type='filled'
                            title='Go Back'
                            handleClick={() => state.intro = true}
                            customStyles='w-fit px-4 py-2.5 font-bold text-sm'
                        />
                    </motion.div>
                    <motion.div
                        className='filtertabs-container'
                        {...slideAnimation('up')}
                    >
                        {FilterTabs.map(tab => (
                            <Tab
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleClick={() => handleActiveFilterTab(tab.name)}
                            />
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Customizer