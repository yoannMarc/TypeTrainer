import { mount } from '@vue/test-utils'

import {render, screen, fireEvent} from '@testing-library/vue'

import { nextTick } from 'vue';
import { describe, test, expect } from 'vitest'
import Timer from '../Timer.vue';


describe('Contrôles du composant Timer', () => {
    test("Contrôle que la barre de progression n'est pas affichée à l'initialisation", () => {
        expect(Timer).toBeTruthy()
        const wrapper = mount(Timer, {props: {duration:2}})
       
        let items = wrapper.findAll('div')
        expect(items.length).toBe(1)
    });

    test("Contrôle l'affichage de la barre de progression avec startTimer", async () => {
        expect(Timer).toBeTruthy()
        const wrapper = mount(Timer, {props: {duration:1}})
       
        wrapper.vm.startTimer()
        await nextTick()
        
        expect(wrapper.findAll('div').length).toBe(2)
 
    })

    test("Contrôle l'arrêt du timer et la disparition de la barre de progression avec endTimer'", async () => {
        expect(Timer).toBeTruthy()
        const wrapper = mount(Timer, {props: {duration:10}})
       
        wrapper.vm.startTimer()
        await nextTick()
        
        expect(wrapper.findAll('div').length).toBe(2)
        
        wrapper.vm.endTimer()
        await nextTick()
        expect(wrapper.findAll('div').length).toBe(1)
    })

    test.skip("La durée est conforme au paramétrage'", async () => {
        //Not yet
    })

    
});