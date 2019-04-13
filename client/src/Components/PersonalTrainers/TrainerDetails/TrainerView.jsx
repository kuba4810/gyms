import React from 'react';
import {getTrainerData} from '../../../services/API/trainers'

class TrainerView extends React.Component{

    state = {}

    componentDidMount(){
       
     }

    render() {

        return(
            <React.Fragment>
        <div className="container-fluid trainerView">
         <div className="trainerViewContent">
         
          <div className="row">

            <div className="col-12">

              <div className="card trainerHeader text-dark">
                <div className="card-header ">
                  <div className="d-flex flex-row justify-content-around">
                    <div className="">
                      <img src="https://muv.pl/wp-content/uploads/user-photos/1206/20180409szymon.png" alt="" style={{width:"8rem", height:"8rem"}}/>
                    </div>
                    <div><h2 style={{color:"#262626"}}>Jacek Filipczyk</h2></div>
                    <div></div>
                    <div style={{fontSize:"26px"}}>5.0 <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                    <div></div>
                    <div></div>

    
                  </div>
                </div>
              </div>

              <div className="row">

                <div className="col-8">

                  <ul className="nav text-dark">
                    <li className="nav-item m-5">
                      <a className="nav-link" href="#goToAboutMe">O mnie</a>
                    </li>
                    <li className="nav-item m-5">
                      <a className="nav-link" href="#goToPrice">Cennik</a>
                    </li>
                    <li className="nav-item m-5">
                      <a className="nav-link" href="#goToOpinion">Opinia</a>
                    </li>
                  </ul>

                  <div className="card">
                    <div className="my-card-img-top mx-auto" ></div>
                  </div>

                  <div className="card border-light mb-3 mt-3">
                    <div className="card-header text-dark">
                      <h3 id="goToAboutMe">O mnie</h3>
                    </div>
                    <div className="card-body text-dark">
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum nesciunt non ullam illo voluptatum aperiam, delectus corporis, dicta quidem eius quo maiores doloribus. Corrupti exercitationem provident ipsa rem? Aliquam, voluptate!
                      Nam, facere. Incidunt deleniti molestiae natus minus assumenda, asperiores temporibus ipsa esse dolore, doloremque nulla, repellendus maiores consequuntur iusto! Cupiditate dolorem beatae, magnam asperiores sunt sint vel adipisci laborum illum!
                      Laudantium cumque animi assumenda similique dignissimos deserunt impedit, iure earum officia aut, nam necessitatibus reiciendis unde ipsa soluta eveniet consectetur. Dolorem odit doloremque aliquid quam corrupti! Magni reprehenderit voluptas modi!</p>
                    </div>
                  </div>

                  <div className="card border-light text-dark mb-3 mt-3">
                    <div className="card-header text-dark">
                      <h3>Zdjęcia</h3>
                    </div>
                    <div className="card-body text-dark">
                       <p> Tu będą zdjęcia !</p>
                    </div>
                  </div>

                  <div className="card border-light text-dark mb-3 mt-3">
                    <div className="card-header text-dark">
                      <h3>Specjalizacje</h3>
                    </div>
                    <div className="card-body text-dark">
                      <p>Crossfit Kettelbells Kulturystyka Masaż Narciarstwo, snowboard Odnowa biologiczna Pływanie Porady dietetyczne i suplementacja Rehabilitacja Trening dla seniorów Trening na świeżym powietrzu Trening siłowy Trening w domu</p>
                    </div>
                  </div>

                  <div className="card border-light text-dark mb-3 mt-3">
                    <div className="card-header text-dark">
                      <h3 id="goToPrice">Cennik</h3>
                    </div>
                    <div className="card-body text-dark">
                      <p>Trening personalny	60 min.	150 zł ZAMÓW Rehabilitacja	1 szt.	150 zł ZAMÓW Plan żywieniowy	1 szt.	300 zł</p>
                    </div>
                  </div>

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
                  </div>

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
                          <p>Swietny trener polecam!</p>
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
                      <p><i class="fas fa-phone"> </i> 665-17-89-24</p>
                      <p><i class="fas fa-envelope"> </i> maks1234@op.pl </p>
                      <p><i class="fas fa-map-marker-alt"> </i> Warszawa, mokotów</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </React.Fragment>
        )
    }
}

export default TrainerView;
