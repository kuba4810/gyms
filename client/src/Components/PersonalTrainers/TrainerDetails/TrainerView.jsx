import React from 'react';
import { connect } from 'react-redux';
import { getTrainerData } from '../../../services/API/trainers';
import { trainerDetailsFetched } from '../../../Actions/trainers';
import Gallery from '../../User/Gallery';

class Trainer extends React.Component {

  state = {
    processing: true
  }

  componentDidMount = async () => {

    const trainer_id = this.props.match.params.id;

    let res = await getTrainerData(trainer_id);

    console.log('Dane trenera *** : ', res)

    if (res.response === 'success') {
      this.props.trainerDetailsFetched(res.data);
    }

    this.setState({
      processing: false,
      currentIndex : 0
    })

  }

  showGallery = (index) => {

    console.log('Dostałem index : ',index)

    this.setState({
      currentIndex: index
    })
    let gallery = document.querySelector('.gallery');

    gallery.classList.add('fadeIn');
    gallery.classList.remove('fadeOut');
    gallery.classList.remove('invisible');

  }

  render() {

    let data = this.props.trainer;

    let photos = '';
    let skills = '';
    let description_skills = '';
    let packages = '';
    let gallery = '';


    if (data) {
      // Create array photos
      photos = data.photos.map((photo,index) =>
        <div className="userAvatar ml-2">
          <div className="overlay">

            <i class="fas fa-eye text-primary" 
            onClick={this.showGallery.bind(null,index)}></i>

          </div>
          <img src={`http://localhost:8080/public/images/${photo.photo_name}.jpg`} alt="" />
        </div>)

      // Create array skills
      skills = data.skills.map(skill =>
        <div className="mr-2 text-dark">
          <i className="fas fa-check text-danger mr-2"></i>
          {skill.name}
        </div>)

      // Create array packages
      packages = data.packages.map(p =>
        <tr>
          <td>{p.name}</td>
          <td>{p.duration}</td>
          <td>{p.price}zł</td>
          <td>
            <div className="btn btn-danger ml-2">Zamów</div>
          </td>
        </tr>)

      // Create array description packages
      description_skills = data.skills.map(s =>

        <div>
          <h5><i class="fas fa-minus mr-2 text-danger"></i> <span className="text-dark">{s.name}</span>    </h5>
          <p className="text-dark ml-3">{s.description}</p>
        </div>)

        if(data.photos.length > 0){
          gallery = <Gallery photos ={[...this.props.trainer.photos]}  currentIndex={this.state.currentIndex}/>
        }
        
    }

    return (
      <React.Fragment>
        <div className="container-fluid trainerView">
          <div className="trainerViewContent">

         

            {
              this.state.processing === false && this.props.trainer ?
                <div className="row animated fadeIn text-dark">
                 {gallery}
                  <div className="col-12">

                    <div className="card trainerHeader text-dark">
                      <div className="card-header ">
                        <div className="d-flex flex-row justify-content-around">
                          <div className="trainerImage">
                            {
                              data.trainer.image ?
                                <img src={`http://localhost:8080/public/images/${data.trainer.image}.jpg`} alt="" style={{ width: "8rem", height: "8rem" }} /> :
                                <img src="https://muv.pl/wp-content/uploads/user-photos/1206/20180409szymon.png" alt="" style={{ width: "8rem", height: "8rem" }} />

                            }

                          </div>
                          <div><h2 style={{ color: "#262626" }}>{data.trainer.first_name} {data.trainer.last_name}</h2></div>
                          <div></div>
                          <div className="text-warning" style={{ fontSize: "26px" }}>5.0 <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                          <div></div>
                          <div></div>


                        </div>
                      </div>
                    </div>

                    <div className="row">

                      <div className="col-8">

                        <ul className="nav text-dark">
                          <li className="nav-item m-2">
                            <a className="nav-link text-dark" href="#goToAboutMe">O mnie</a>
                          </li>
                          <li className="nav-item m-2">
                            <a className="nav-link text-dark" href="#goToPrice">Cennik</a>
                          </li>
                          <li className="nav-item m-2">
                            <a className="nav-link text-dark" href="#goToOpinion">Opinia</a>
                          </li>
                        </ul>

                        <div className="card">
                          <div className="my-card-img-top mx-auto" ></div>
                        </div>

                        <div className="card border-light mb-3 mt-3">
                          <div className="card-header text-dark">
                            <h3 id="goToAboutMe">O mnie</h3>
                          </div>
                          <div className="card-body text-dark trainerDescription">
                            {data.trainer.description}
                          </div>
                        </div>

                        <div className="card border-light text-dark mb-3 mt-3">
                          <div className="card-header text-dark">
                            <h3>Zdjęcia</h3>
                          </div>
                          <div className="card-body text-dark d-flex">
                            {photos.length > 0 ?
                            photos :
                            'Brak zdjęć'}
                          </div>
                        </div>

                        <div className="card border-light text-dark mb-3 mt-3">
                          <div className="card-header text-dark">
                            <h3>Specjalizacje</h3>
                          </div>
                          <div className="card-body text-dark text-dark">
                            <div className="d-flex">
                              {skills}
                            </div>
                            <br />
                            <div className="ml-5">
                            {description_skills}
                            </div>
                          </div>
                        </div>

                        <div className="card border-light text-dark mb-3 mt-3">
                          <div className="card-header text-dark">
                            <h3 id="goToPrice">Cennik</h3>
                          </div>
                          <div className="card-body text-dark">
                            <table className="trainerPackagesTable table table-striped table-dark">

                              <thead>
                              <tr> <th>Nazwa</th> <th>Czas trwania/ilość</th> <th>Cena</th> </tr>
                              </thead>
                              {packages}
                            </table>
                          </div>
                        </div>
                        {/* 
                        <div className="card border-light text-dark mb-3 mt-3">
                          <div className="card-header text-dark">
                            <h3 id="goToOpinion">Opinie</h3>
                          </div>
                          <div id="addOpinion" className="card-body text-dark">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora inventore voluptatem nihil quibusdam et, atque adipisci totam ratione. Totam repellat incidunt ratione aliquid saepe ullam assumenda dolorem voluptatum ex excepturi.
                            Iure, laboriosam animi nam, magni laudantium perspiciatis veritatis voluptate dolorum minima voluptatem commodi a non mollitia, blanditiis eos doloremque natus dicta vel consectetur eveniet repellat! Corporis, quam quia. Dolor, sunt!
                            Dolorum, consequatur. Deleniti, praesentium! Accusantium ullam inventore, tempora labore maxime eum ipsa deserunt eius, exercitationem minima voluptate obcaecati repellendus laudantium distinctio sunt nesciunt temporibus nulla similique nostrum reprehenderit illo saepe?
                            Mollitia possimus exercitationem similique perferendis, eligendi itaque vero impedit accusamus iure, cupiditate corrupti. Ducimus sequi facilis amet expedita nesciunt dolorem dolores voluptatum assumenda impedit, et quod saepe quidem odio dolore?
                            Reiciendis ad doloribus, ea at sint eum pariatur iusto incidunt commodi quam voluptas sed deleniti. Reiciendis alias necessitatibus, sit nobis sed nulla eos excepturi illo, culpa soluta iure, esse totam.
                            Ullam, corrupti velit. Libero exercitationem veniam possimus ducimus error similique cumque excepturi sint rem! Adipisci, dolore. Provident nihil excepturi quisquam, officia voluptatum doloremque iure magnam hic placeat quo. Aliquid, esse!
                            Aliquam reprehenderit distinctio tenetur reiciendis suscipit a sunt. Inventore harum doloremque sunt non eos dicta consectetur soluta accusamus quaerat et repellendus quos a, maiores molestias sapiente. Nemo neque maxime aut?
                            Qui inventore iure ea delectus quos? Nam magnam necessitatibus inventore error, rerum dolorem pariatur blanditiis quia magni omnis vitae recusandae, dolores maiores porro hic rem eveniet ratione ipsum quas quos.
                            Quaerat iusto magnam quos deleniti quae ducimus earum distinctio in, ipsam inventore, voluptatem accusantium vitae natus dignissimos totam, eos harum expedita praesentium. Earum natus culpa alias temporibus corporis doloremque itaque!
                    Explicabo illum similique voluptatum sed et facilis, dolore dolor modi ducimus! Odio molestiae suscipit necessitatibus ipsam delectus impedit enim quo aut? Veniam dolor consequuntur cupiditate libero blanditiis qui dolorem a!</p>
                          </div>
                        </div> */}

                        {/* <form onSubmit={this.sendComment}>
                  <legend id="wystawKomentarz"><h3>Wystaw Komentarz</h3></legend>
                  <div className="form-group">
                    <textarea className="form-control" name="text" id="" cols="30" rows="10"></textarea>
                  </div>
                  <button type="submit" className="btn-success">Wyślij</button>
                </form> */}

                        <div className="container mt-3 trainerComment text-dark">
                          <h2>Opinie</h2>
                          <div className="mediaComment p-3">
                            <img src="https://img.icons8.com/color/48/c0392b/administrator-male.png" alt="" className="mr-3 mt-3 rounded-circle" style={{ width: 60 + "px" }} />
                            <div className="mediaBodyComment text-dark">
                              <h4>Jacek <small><i>wtorek-19-sierpień-2018</i></small></h4>
                              <p>Profesjonalne podejście zarówno do treningów jak i klienta. Przekazuje w prosty a zarazem profesjonalny sposób zawiłości treningowe. Szczególnie ciekawe okazały się testy funkcjonalne, dzięki czemu ćwiczenia są dobrane pod moje indywidualne możliwości</p>
                            </div>
                          </div>
                        </div>




                      </div>
                      <div className="col-3">

                        <div className="card my-4 ">
                          <div className="card-header ">
                            <div className="card-title text-dark">Trenowałeś ze mną?</div>
                            <button className="btn btn-warning"><a href="#addOpinion">Dodaj opinie!</a></button>
                          </div>
                        </div>

                        <div className="card text-dark">
                          <div className="card-header">
                            <div className="card-title text-dark">Dane kontaktowe i adresowe:</div>
                          </div>
                          <div className="card-body text-dark">
                            <p><i class="fas fa-phone"> </i> {data.trainer.phone_number}</p>
                            <p><i class="fas fa-envelope"> </i> {data.trainer.mail} </p>
                            <p>
                              <i class="fas fa-map-marker-alt"> </i>
                              {data.trainer.city}
                              {
                                (data.trainer.voivodeship !== null && data.trainer.voivodeship !== 'Brak danych') ?
                                  `,${data.trainer.voivodeship}` :
                                  ''
                              }
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div> :
                <div className="dataLoadingMessage">

                  <h3>Ładowanie danych</h3>
                  <div className="littleSpinner" ></div>

                </div>
            }

          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    trainer: state.trainers.trainerDetails
  }
}

const mapDispatchToProps = { trainerDetailsFetched }

const TrainerView = connect(mapStateToProps, mapDispatchToProps)(Trainer);

export default TrainerView;
