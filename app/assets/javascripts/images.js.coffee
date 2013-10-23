animateImages = ->
  if state.current_page == "images"
    requestAnimationFrame( animate )
    renderImages()
    updateImages()
  else
  	false


renderImages = ->
  render.render( scene, camera)


imagesTransition = ->


