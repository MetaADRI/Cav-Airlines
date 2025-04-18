window.addEventListener('scroll', function(){
    if(this.scrollY){
stickyNav.style.backgroundColor= 'black';
    }else{
stickyNav.style.backgroundColor= 'transparent';
    }
});