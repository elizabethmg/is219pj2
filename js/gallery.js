// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/
function getQueryParams(qs) {     
	qs = qs.split("+").join(" ");     
	var params = {},         
		tokens,         
		re = /[?&]?([^=]+)=([^&]*)/g;     

	while (tokens = re.exec(qs)) {         
		params[decodeURIComponent(tokens[1])]             
		= decodeURIComponent(tokens[2]);    
	}     
	return params; 
} 
var $_GET = getQueryParams(document.location.search);

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mURL = "images.json";

if($_GET["json"] != undefined){
	mURL = $_GET["json"];
}

// Counter for the mImages array
var mCurrentIndex = 0;

function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string
	$('#photo').attr("src",mImages[mCurrentIndex].image);
	$('.location').text('Location: '+ mImages[mCurrentIndex].location);
	$('.description').text('Description: '+ mImages[mCurrentIndex].description);
	$('.date').text('Date: '+ mImages[mCurrentIndex].date);
	mCurrentIndex++;

	if(mCurrentIndex >= mImages.length){
		mCurrentIndex=0;
	}

	console.log('swap photo');
}

// Holds the retrived JSON information
var mJson;
// Array holding GalleryImage objects (see below).
var mImages = [];

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();
mRequest.onreadystatechange = function() {  
		if (mRequest.readyState == 4 && mRequest.status == 200) {
			try { 
				mJson=JSON.parse(mRequest.responseText);

			 for(var i=0; i<mJson.images.length; i++){
			 	var myLine=mJson.images[i];
			 	mImages.push(new GalleryImage(myLine.imgLocation, myLine.description, myLine.date, myLine.imgPath));
			 }

			console.log(mImages); 
		} catch(err) { 
			console.log(err.message+" in "+ mRequest.responseText);
			return;
			 } 
		} 
}; 

mRequest.open("GET",mURL, true); 
mRequest.send();

// console.log($_GET["json"]); 

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

	$('#nextPhoto').click(function(){
		swapPhoto();
	});
	$('#prevPhoto').click(function(){
		if(mCurrentIndex == 0){
			mCurrentIndex=mImages.length-2;
		}
		else if(mCurrentIndex==1){
			mCurrentIndex=mImages.length-1;
		}
		else{
			mCurrentIndex-=2;
		}
		swapPhoto();
	})
	$('.moreIndicator').click(function(){
		$("img.rot90").toggleClass("rot270", 3000)
		$('.details').slideToggle(1000);
	})

});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function GalleryImage(location, description, date , img) {
	//implement me as an object to hold the following data about an image:
	this.location=location;//1. location where photo was taken
	this.description=description;//2. description of photo
	this.date=date;//3. the date when the photo was taken
	this.img=img;//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
}
