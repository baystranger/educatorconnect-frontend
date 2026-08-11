import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LandingPage from './LandingPageNew.vue/index.js'

describe('LandingPage', () => {
  it('renders the hero heading and primary call to action', () => {
    const wrapper = mount(LandingPage)

    expect(wrapper.text()).toContain('Early Learning Hub')
    expect(wrapper.text()).toContain('Find Jobs')
  })
})
