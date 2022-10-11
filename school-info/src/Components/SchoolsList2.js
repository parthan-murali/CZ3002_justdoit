
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faTrainSubway } from "@fortawesome/free-solid-svg-icons";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import mrtIcon from "../Images/mrt-icon.png";
import "../ComponentsCSS/SchoolsList2.css";

import CompareContext from "../Contexts/CompareContext";
import { useContext } from "react";

function SchoolsList2({ schools }) {
  const compareCtx = useContext(CompareContext);
  const toCompare = compareCtx.itemToCompare(schools._id);

  function removeCompare() {
    if (toCompare) {
      compareCtx.removeFromCompare(schools._id);
    }
  }

  /* get subjects */
  let subjects = undefined;
  if (schools.subject_desc !== undefined) {
    subjects = [];
    for (let i = 0; i < schools.subject_desc.length; i++) {
      if (i !== schools.subject_desc.length - 1) {
        subjects.push(schools.subject_desc[i].toLowerCase() + " ,  ");
      } else {
        subjects.push(schools.subject_desc[i].toLowerCase());
      }
    }
  }

  let moe_programme = [];
  if (schools.moe_programme !== undefined) {
    for (let i = 0; i < schools.moe_programme.length; i++) {
      if (i !== schools.moe_programme.length - 1) {
        moe_programme.push(schools.moe_programme[i].toLowerCase() + " ,  ");
      } else {
        moe_programme.push(schools.moe_programme[i].toLowerCase());
      }
    }
  }

  /* for sports */
  let physical_sports = [];
  if (schools.physical_sports !== undefined) {
    for (let i = 0; i < schools.physical_sports.length; i++) {
      if (i !== schools.physical_sports.length - 1) {
        physical_sports.push(schools.physical_sports[i].toLowerCase() + " ,  ");
      } else {
        physical_sports.push(schools.physical_sports[i].toLowerCase());
      }
    }
  }

  /* for visual and pa */
  let visual_and_pa = [];
  if (schools.visual_and_pa !== undefined) {
    for (let i = 0; i < schools.visual_and_pa.length; i++) {
      if (i !== schools.visual_and_pa.length - 1) {
        visual_and_pa.push(schools.visual_and_pa[i].toLowerCase() + " ,  ");
      } else {
        visual_and_pa.push(schools.visual_and_pa[i].toLowerCase());
      }
    }
  }

  /* for clubs and societies */
  let clubs_and_societies = [];
  if (schools.clubs_and_societies !== undefined) {
    for (let i = 0; i < schools.clubs_and_societies.length; i++) {
      if (i !== schools.clubs_and_societies.length - 1) {
        clubs_and_societies.push(
          schools.clubs_and_societies[i].toLowerCase() + " ,  "
        );
      } else {
        clubs_and_societies.push(schools.clubs_and_societies[i].toLowerCase());
      }
    }
  }

  /* for uniformed groups */
  let uniformed_groups = [];
  if (schools.uniformed_groups !== undefined) {
    for (let i = 0; i < schools.uniformed_groups.length; i++) {
      if (i !== schools.uniformed_groups.length - 1) {
        uniformed_groups.push(
          schools.uniformed_groups[i].toLowerCase() + " ,  "
        );
      } else {
        uniformed_groups.push(schools.uniformed_groups[i].toLowerCase());
      }
    }
  }

  /* for others */
  let others = [];
  if (schools.others !== undefined) {
    for (let i = 0; i < schools.others.length; i++) {
      if (i !== schools.others.length - 1) {
        others.push(schools.others[i].toLowerCase() + " ,  ");
      } else {
        others.push(schools.others[i].toLowerCase());
      }
    }
  }

  let electiveBoolean = false;
  if (
    moe_programme.length > 0 ||
    schools.alp_domain !== undefined ||
    schools.llp_domain1 !== undefined ||
    schools.llp_domain2 !== undefined
  ) {
    electiveBoolean = true;
  }

  return (
    <div className="school-compare">
      <div className="school-compare-list">
        <div key={schools._id}>
          <SchoolsCompInfo
            key={schools._id}
            name={schools.school_name}
            _id={schools._id}
            school_name={schools.school_name}
            email_address={schools.email_address}
            address={schools.address}
            postal_code={schools.postal_code}
            mrt_desc={schools.mrt_desc}
            telephone_no={schools.telephone_no}
            bus_desc={schools.bus_desc}
            principal_name={schools.principal_name}
            url_address={schools.url_address}
            subjects={subjects}
            physical_sports={physical_sports}
            visual_and_pa={visual_and_pa}
            clubs_and_societies={clubs_and_societies}
            uniformed_groups={uniformed_groups}
            others={others}
            moe_programme={schools.moe_programme}
            alp_domain={schools.alp_domain}
            alp_title={schools.alp_title}
            llp_domain1={schools.llp_domain1}
            llp_title1={schools.llp_title1}
            llp_domain2={schools.llp_domain2}
            llp_title2={schools.llp_title2}
            electiveBoolean={electiveBoolean}
            removeCompare={removeCompare}
          />
        </div>
      </div>
    </div>
  );
}

const SchoolsCompInfo = ({
  _id,
  name,
  address,
  postal_code,
  email_address,
  mrt_desc,
  telephone_no,
  bus_desc,
  principal_name,
  url_address,
  subjects,
  physical_sports,
  visual_and_pa,
  clubs_and_societies,
  uniformed_groups,
  others,
  moe_programme,
  alp_domain,
  alp_title,
  llp_domain1,
  llp_title1,
  llp_domain2,
  llp_title2,
  electiveBoolean,
  removeCompare,
}) => {
  if (!_id) return <div />;
  return (
    <div>
      <div className="compare-school-names">
        {name}
        <FontAwesomeIcon
          className="fa-delete-left"
          icon={faDeleteLeft}
          onClick={removeCompare}
        />
      </div>
      <div className="school-info-compare">
        <p className="gen-info-compare ">General Information</p>

        <div className="school-location-compare">
          <FontAwesomeIcon
            className="fa-location-dot-icon-compare"
            icon={faLocationDot}
          />

          <span className="school-address-compare">{address + " ,"}</span>
          <div className="school-postal-compare">{"S" + postal_code}</div>
        </div>

        <div className="school-mrt-wrapper-compare">
          <FontAwesomeIcon
            className="fa-train-subway-icon"
            icon={faTrainSubway}
          />
          <img className="mrt-icon" src={mrtIcon} alt="mrt icon" />

          <div className="school-mrt-desc-compare">{mrt_desc}</div>
        </div>

        <div className="school-bus-wrapper-compare">
          <FontAwesomeIcon className="fa-bus-icon-compare" icon={faBus} />
          <span className="school-bus-desc-compare"> {bus_desc}</span>
        </div>

        <div className="school-email-address-compare">
          <span className="email-address-compare">
            <br />
            <b>Email: </b> {email_address}
          </span>
        </div>

        <div className="school-tele-compare">
          <b>Telephone: </b>
          {telephone_no}
        </div>

        <div className="principal-compare">
          <br />
          <b> Principal: </b>
          {principal_name}
        </div>

        <div className="website-compare">
          <b>
            <a href={url_address} target="_blank">
              Visit the School Page{" "}
            </a>
          </b>
        </div>
      </div>{" "}
      {/* div for subjects */}
      {subjects !== undefined && (
        <div className="subjects-card-compare">
          <div className="subjects-compare">
            Subjects Offered
            <div className="subjects-desc-compare">{subjects}</div>
          </div>
        </div>
      )}
      {/* div for ccas*/}
      <div className="cca-card-compare">
        {
          <div className="cca-container-compare">
            CCA Information
            {physical_sports !== undefined && physical_sports.length > 0 && (
              <div className="cca-div-compare">
                <div className="cca-category-compare">Physical Sports </div>
                <div className="cca-name-compare"> {physical_sports}</div>
              </div>
            )}
            {visual_and_pa !== undefined && visual_and_pa.length > 0 && (
              <div className="cca-div-compare">
                <div className="cca-category-compare">
                  Visual & Performing Arts
                </div>
                <div className="cca-name-compare"> {visual_and_pa}</div>
              </div>
            )}
            {clubs_and_societies !== undefined &&
              clubs_and_societies.length > 0 && (
                <div className="cca-div-compare">
                  <div className="cca-category-compare">Clubs & Societies </div>
                  <div className="cca-name-compare"> {clubs_and_societies}</div>
                </div>
              )}
            {uniformed_groups !== undefined && uniformed_groups.length > 0 && (
              <div className="cca-div-compare">
                <div className="cca-category-compare">Uniformed Groups </div>
                <div className="cca-name-compare">{uniformed_groups}</div>
              </div>
            )}
            {others !== undefined && others.length > 0 && (
              <div className="cca-div-compare">
                <div className="cca-category-compare">Others </div>
                <div className="cca-name-compare"> {others} </div>
              </div>
            )}
          </div>
        }
      </div>
      {/* div for elective*/}
      {electiveBoolean && (
        <div className="elective-card-compare">
          <div className="elective-container-compare">
            Electives & Programmes
            {moe_programme !== undefined && (
              <div className="elective-div-compare">
                <div className="elective-category-compare">
                  {" "}
                  MOE Programme :
                </div>
                <div className="elective-name-compare"> {moe_programme} </div>
              </div>
            )}
            {alp_domain != "NULL" && alp_domain !== undefined && (
              <div className="elective-div-compare">
                <div className="elective-category-compare">{alp_domain} </div>
                <div className="elective-name-compare"> {alp_title}</div>
              </div>
            )}
            {llp_domain1 != "NULL" && llp_domain1 !== undefined && (
              <div className="elective-div-compare">
                <div className="elective-category-compare">{llp_domain1} </div>
                <div className="elective-name-compare"> {llp_title1} </div>
              </div>
            )}
            {llp_domain2 != "NULL" && llp_domain2 !== undefined && (
              <div className="elective-div-compare">
                <div className="elective-category-compare">{llp_domain2} </div>
                <div className="elective-name-compare">{llp_title2} </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsList2;
