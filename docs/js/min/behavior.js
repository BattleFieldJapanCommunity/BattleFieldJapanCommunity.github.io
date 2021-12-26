const animationTargets = document.querySelectorAll('.animate, .animate-right'),
  site = document.querySelector('.site_container'),
  scrollOffset = 0.6,
  animate = () => {
    console.log('called'),
      animationTargets.forEach((e) => {
        const t = e.getBoundingClientRect().top + 0.6 * e.clientHeight
        window.innerHeight <= t && e.classList.remove('shown'), window.innerHeight > t && e.classList.add('shown')
      })
  },
  headerAnimate = () => {
    const e = document.querySelector('.header'),
      t = document.querySelector('.aboutus').getBoundingClientRect().top
    window.innerHeight <= t && e.classList.remove('header_white'), window.innerHeight > t && e.classList.add('header_white')
  }
headerAnimate(), animate()
var scoll = new SmoothScroll('#site', { speed: 500, speedAsDuration: !0 })
site.addEventListener('scroll', () => {
  headerAnimate(), animate()
})
