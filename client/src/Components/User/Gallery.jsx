import React, { Component } from 'react';
class Gallery extends Component {
    state = {
        currentPhoto: null,
        currentIndex: 0
    }

    componentDidMount() {
        this.setState({
            currentPhoto: this.props.photos[this.props.currentIndex].photo_name,
            currentIndex: this.props.currentIndex
        })

        console.log('Gallery mount', this.props);
    }
    // COMPONENT DID UPDATE
    // ------------------------------------------------------------------------
    componentDidUpdate(prev) {
        if (prev.photos.length !== this.props.photos.length) {
            console.log(this.props.photos)
            this.setState({
                currentPhoto: this.props.photos[this.props.currentIndex].photo_name,
                currentIndex: this.props.currentIndex
            }, () => {
                console.log(this.state);
            })
        }

        if (prev.currentIndex !== this.props.currentIndex) {
            this.setState({
                currentPhoto: this.props.photos[this.props.currentIndex].photo_name,
                currentIndex: this.props.currentIndex
            }, () => {
                console.log(this.state);
            })
        }
    }

    // CHOOSE PHOTO
    // ------------------------------------------------------------------------
    choosePhoto = (name, index) => {
        this.setState({
            currentPhoto: name,
            currentIndex: index
        })
    }

    // NEXT IMAGE
    // ------------------------------------------------------------------------
    nextImage = () => {

        if (this.props.photos.length - 1 > this.state.currentIndex) {
            let index = ++this.state.currentIndex;
            this.setState({
                currentIndex: index,
                currentPhoto: this.props.photos[index].photo_name
            }, () => {
                console.log(this.state);
            })
        }

    }

    // PREVIOUS IMAGE
    // ------------------------------------------------------------------------
    prevImage = () => {

        if (this.state.currentIndex > 0) {
            let index = --this.state.currentIndex;
            this.setState({
                currentIndex: index,
                currentPhoto: this.props.photos[index].photo_name
            })
        }

    }

    // HIDE GALLERY
    // ------------------------------------------------------------------------
    hideGallery = () => {

        let gallery = document.querySelector('.gallery');

        gallery.classList.remove('fadeIn');
        gallery.classList.add('fadeOut');

        setTimeout(() => {
            gallery.classList.add('invisible');
        }, 500);

    }

    render() {

        console.log('Galeria render : ', this.props.photos)

        let photos = this.props.photos.map((photo, index) => (
            <div className="userAvatar m-2 miniatureImage"
                onClick={this.choosePhoto.bind(null, photo.photo_name, index)}>
                <img src={`http://localhost:8080/public/images/${photo.photo_name}.jpg`} />
            </div>
        ))
        let image = '';

        if (this.state.currentPhoto !== null) {
            image = <img src={`http://localhost:8080/public/images/${this.state.currentPhoto}.jpg`} />
        }
        return (
            // Container
            <div class="gallery animated invisible ">

                <div className="close p-2" onClick={this.hideGallery}>
                    <i className="fas fa-times text-danger"></i>
                </div>

                {/* Image container */}
                <div className="bigImage  h-50 position-relative mt-3 text-dark">

                    {/* Left arrow */}
                    {
                        this.state.currentIndex > 0 &&
                        <div className="prevImage d-flex align-items-center"
                            onClick={this.prevImage}>
                            <i class="fas fa-angle-left"></i>
                        </div>
                    }

                    {/* Big image */}
                    {/* <div className="image w-50 h-50"> */}
                    {image}
                    {/* </div> */}

                    {/* Right arrow */}

                    {
                        this.state.currentIndex < this.props.photos.length-1 &&
                        <div className="nextImage d-flex align-items-center"
                            onClick={this.nextImage}>
                            <i class="fas fa-angle-right"></i>
                        </div>
                    }

                </div>


                <div className="miniatureContainer d-flex justify-content-center">
                    {photos}
                </div>


            </div>
        );
    }
}

export default Gallery;