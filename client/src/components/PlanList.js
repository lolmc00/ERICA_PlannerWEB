import React, {useState, useEffect} from 'react';
import './css/PlanList.css';
import { PlanItem } from 'components';
import { faPlus, faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {faWindowMinimize} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import * as planTypes from './PlannerTypes';
import { useSelector, useDispatch } from 'react-redux';
import { postPlanRequest } from 'actions/planner';
import moment from 'moment';

/* addButton이 true일 경우 type값이 undefined이면 안됨.
Plan을 생성할 때 해당 type으로 생성되기 때문 */ 
const PlanList = React.memo(({author, planList, type, date, cycleDay, addButton, turnOnTaskRatio, color, title}) => {
  // Redux hooks
  const dispatch = useDispatch();
  const [postStatus] = useSelector(state => [state.planner.toJS().post] , []);

  /* POST data = {title, exp, date, completedAt, month, year, ...} */
  const onCreateClick = (author, type, date, cycleDay) => {
    if(isOpenedItemBox === false)
      setOpenedItemBox(true);
    let data = {author, type, date, title: "일정 설명", exp: 10};
    data[cycleDay] = true;
    dispatch(postPlanRequest(data));
  }

  const [isOpenedItemBox, setOpenedItemBox] = useState(true);
  const [completedPlansCount, setcompletedPlansCount] = useState(0);
  const handleOnClickSizingBox = () => {
    if(isOpenedItemBox)
      setOpenedItemBox(false);
    else
      setOpenedItemBox(true);
  }
  const mapToComponents = planList => {
    let planItems = planList.map((plan, i) => {
      return (<PlanItem key={i} author={author} title={plan.title} exp={plan.exp} 
        id={plan.id} type={plan.type} date={date} completedAt={plan.completedAt} idx={i}/>);
    });
    return planItems;
  };
  useEffect(()=> {
    let count = 0;
    for(let plan in planList){
      if(plan.completedAt !== undefined && plan.completedAt !== null){
        // LOOP_PLAN은 여러 번 반복해서 깰 수 있으므로, 수행한 날짜가 오늘인지 아닌지 판단해야함.
        if(plan.type === planTypes.LOOP_PLAN){
          if(moment(plan.completedAt).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD'))
            count++;
        }else{
          count++;
        }
      }
    }
    setcompletedPlansCount(count);
  }, [planList]);
  const getDayOfWeek = (date) => {
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    return week[date.getDay()];
  }
  const getDateTitleFormat = (date, type) => {
    if(title !== undefined)
      return title;
    if(type === planTypes.DAILY_PLAN)
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " (" + getDayOfWeek(date) + ")";
    else if(type === planTypes.MONTHLY_PLAN)
      return date.getFullYear() + "년 " + (date.getMonth() + 1) + "월";
    else if(type === planTypes.YEARLY_PLAN)
      return date.getFullYear() + "년";
    else if(type === planTypes.LOOP_PLAN){
      const cycleDayToKorObj = {
        cycleMonday: "월요일",
        cycleTuesday: "화요일",
        cycleWednesday: "수요일",
        cycleThursday: "목요일",
        cycleFriday: "금요일",
        cycleSaturday: "토요일",
        cycleSunday: "일요일",
      }
      return cycleDayToKorObj[cycleDay];
    }
  }
  const getTaskCompletedRatio = (completedPlansCount, planListLength) => {
    if(planListLength === 0)
      return 0;
    return Math.round((completedPlansCount / planListLength) * 100);
  }
  return (
    <div className="plan_box">
      <div className="plan_header" style={{backgroundColor: color}}> 
        <div className="date">{getDateTitleFormat(date, type)} </div>
        {turnOnTaskRatio ? <div className="completedRatio">수행률: {getTaskCompletedRatio(completedPlansCount, planList.length)}% ({completedPlansCount} / {planList.length})</div> : undefined}
        <div className="right_toolbox">
          {addButton ? postStatus.date.filter(dateVal => { return dateVal.getTime() === date.getTime()}).length === 0 ? 
          <Button className="tool plan_add_btn" onClick={() => onCreateClick(author, type, date, cycleDay)}><FontAwesomeIcon icon={faPlus}/></Button>
          : 
          <Button className="tool plan_add_btn"><CircularProgress size="1rem" style={{color:"#000000"}}/></Button> : undefined}
        </div>
      </div>
      <Button className="plan_box_sizing_row" style={{backgroundColor: color}} onClick={handleOnClickSizingBox}>
        <FontAwesomeIcon icon={isOpenedItemBox ? faWindowMinimize : faChevronDown} className="tool plan_box_sizing_btn"/>
      </Button>
      <ul className="plan_item_container" style={{maxHeight: isOpenedItemBox ? "100000px" : "0px"}}>
         {mapToComponents(planList)}
      </ul>
    </div>
  );
});

export default PlanList;
