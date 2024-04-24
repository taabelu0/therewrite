import {useParams} from "react-router-dom";
import {pdfAPI} from "../apis/pdfAPI";
import React, {Component, useState} from "react";
import {PdfHighlighter, PdfLoader} from "react-pdf-highlighter";
import '../style/demo_.scss';

const annoationCategories = [
    {
        name:"Definition",
        description:"Select this category to add definitions of terms you found in the documents."
    },
    {
      name:"Explosion",
      description: "Select to add terms, notes and descriptions or external resources, e.g. links to material you feel needs to included in the document."
    },
    {
        name: "Deletion",
        description: "Select to signal that you would like to delete specific terms in the document altogether. Add some thoughts or links to sources that explain why you feel the term should be deleted."
    },
    {
        name:"Correction",
        description: "Select to propose changes to the term in question. Note that correction has an authoritative connotation: you're suggesting a definitive replacement!"
    },
    {
        name: "Speculation",
        description: "Select this category if you would like to avoid the authoritative connotation of correction. Speculation is future-oriented, open-ended, evocative and can involve uncertain trajectories."
    },
    {
        name: "Addition",
        description: "For additions."
    }
    ]
const initialUrl = {"url": ""};
function Demo() {
    const [creatingComponent, setCreatingComponent] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Definition");
    const [toggleAnnotationCategories,setToggleAnnotationCategories] = useState(false);

    let { pdfName } = useParams();
    initialUrl.url = pdfAPI.getUrl(pdfName);

    const toggleCategories = () => {
        setToggleAnnotationCategories(prevState => !prevState);
    }
    return (
        <div>
            <Core pdfName={pdfName}></Core>
            <section id={"demo-workspace-scroll"}>
                <nav id="demo-sidebar-nav">
                    <button className="toggleCategoriesBtn" onClick={toggleCategories}>Annotation Categories</button>
                    <p className="category-text">Select a category while annotating to mark your highlights and
                        notes.</p>
                    <div id="demo-category-selection">
                        {annoationCategories.map((cat, key) => (
                            <div
                                className={`demo-category demo-category-${cat.name.toLowerCase()} ${selectedCategory === cat.name ? "category-active" : ""} ${toggleAnnotationCategories ? 'demo-categories-open' : ''}`}
                                key={key}
                                onClick={() => setSelectedCategory(`${cat.name}`)}
                            >
                                <p className={"demo-category-title"}>{cat.name}</p>
                                <p className={`demo-category-desc`}>{cat.description}</p>
                            </div>
                        ))}
                    </div>
                    <div id="demo-toolbar">
                        <div className={`demo-styles ${'demo-styles-' + selectedCategory}`}>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "HighlightAnnotation" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                id="add-post-it-green"
                                onClick={() => setCreatingComponent("HighlightAnnotation")}
                            >
                                <svg id="Abc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m22.0708008,10.9147949c-.4945679,0-1.1256714.2119141-1.9804688.9429932v4.3561401c.6539307.6292725,1.3067627.9000854,1.9033203.9000854,1.140625,0,2.1152344-.9863281,2.1152344-3.0410156,0-2.0556641-.8369141-3.1582031-2.0380859-3.1582031Z"/>
                                    <polygon className="cls-1"
                                             points="9.7390747 13.5837402 12.9501343 13.5837402 11.3565674 8.8212891 9.7390747 13.5837402"/>
                                    <path className="cls-1"
                                          d="m1.8812256,1.7756348v20.4486694h36.2375488V1.7756348H1.8812256Zm14.9854736,16.0356445h-4.3554688v-.6503906l1.5728149-.1885376-.883606-2.640564h-3.7154541l-.8873291,2.6124878,1.5610352.2146606v.6523438h-3.6679688v-.6523438l1.3421631-.2011719,3.4146729-9.9360352h1l3.4060669,9.9926147,1.2130737.1465454v.6503906Zm5.390625.2099609c-.7662964,0-1.5195923-.2692871-2.2078247-1.1346436l-.1329956,1.0887451-2.40625-.1630859v-.5712891l1.2024536-.2244873c.0169067-.8031616.0250854-1.8520508.0250854-2.5655518v-7.0273438l-1.3095703-.1582031v-.5664062l2.4521484-.7202148.2265625.1298828-.0644531,2.2705078v2.8654785c.7634888-.850708,1.5894165-1.2390137,2.4570312-1.2390137,1.6992188,0,3.046875,1.4521484,3.046875,3.9287109,0,2.4716797-1.4208984,4.0869141-3.2890625,4.0869141Zm8.2734375,0c-2.1933594,0-3.59375-1.5283203-3.59375-3.9912109,0-2.5195312,1.7705078-4.0244141,3.703125-4.0244141,1.4394531,0,2.6240234.890625,2.8271484,2.0800781-.0849609.4101562-.3310547.6054688-.7412109.6054688-.5332031,0-.7597656-.3232422-.8691406-.765625l-.2948608-1.0617676c-.3048706-.0877075-.5982666-.1315918-.8613892-.1315918-1.3652344,0-2.3574219,1.0898438-2.3574219,3.1445312,0,2.0078125,1.0615234,3.1064453,2.5566406,3.1064453.9199219,0,1.7216797-.4423828,2.2158203-1.2275391l.3935547.2089844c-.4414062,1.3271484-1.4736328,2.0566406-2.9785156,2.0566406Z"/>
                                </svg>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "ParagraphCustom" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("ParagraphCustom")}
                            >
                                <svg id="Effect_over" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m37.1189519,12.7117589H2.8816472c-.5527344,0-1,.4472656-1,1s.4472656,1,1,1h34.2373047c.5527344,0,1-.4472656,1-1s-.4472656-1-1-1Z"/>
                                </svg>
                                <svg id="Effect_over" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m18.7377874,11.7117589h1.527832c.7665405-.6137695,1.3449707-.7969971,1.8051758-.7969971.5957642,0,1.1010742.2727661,1.4599609.7969971h1.5447998c-.5360718-1.0942383-1.4796753-1.7061768-2.5760498-1.7061768-.8676147,0-1.6935425.3883057-2.4570312,1.2390137v-2.8654785l.0644531-2.2705078-.2265625-.1298828-2.4521484.7202148v.5664062l1.3095703.1582031v4.288208Z"/>
                                    <path className="cls-1"
                                          d="m28.8977605,11.7117589c.4221802-.6384888,1.052063-.9796143,1.8029175-.9796143.2631226,0,.5565186.0438843.8613892.1315918l.2354736.8480225h1.5650024c-.3632812-.99646-1.4390869-1.7061768-2.7224121-1.7061768-1.2297363,0-2.3890991.6138306-3.0731812,1.7061768h1.3308105Z"/>
                                    <polygon className="cls-1"
                                             points="10.3748113 11.7117589 11.3565618 8.821256 12.3237859 11.7117589 13.8461858 11.7117589 12.247553 7.0216954 11.247553 7.0216954 9.6357366 11.7117589 10.3748113 11.7117589"/>
                                    <path className="cls-1"
                                          d="m23.8261663,15.7117589c-.3682861.9353638-1.0579224,1.4022217-1.8325195,1.4022217-.5965576,0-1.2493896-.270813-1.9033203-.9000854v-.5021362h-1.3588867c-.0041504.4498901-.0103149.9058228-.0187378,1.3046875l-1.2024536.2244873v.5712891l2.40625.1630859.1329956-1.0887451c.6882324.8653564,1.4415283,1.1346436,2.2078247,1.1346436,1.3689575,0,2.491394-.873291,2.9969482-2.3094482h-1.4281006Z"/>
                                    <polygon className="cls-1"
                                             points="9.0162908 15.7117589 8.2610417 15.7117589 7.8328801 16.9577306 6.490717 17.1589025 6.490717 17.8112462 7.5395452 17.8112462 8.303217 17.8112462 10.1586858 17.8112462 10.1586858 17.1589025 8.5976506 16.9442418 9.0162908 15.7117589"/>
                                    <path className="cls-1"
                                          d="m30.8998967,16.9831212c-.9450073,0-1.7146606-.4413452-2.1546631-1.2713623h-1.5465698c.5008545,1.4563599,1.6947632,2.3094482,3.3320923,2.3094482,1.5048828,0,2.5371094-.7294922,2.9785156-2.0566406l-.3935547-.2089844c-.4941406.7851562-1.2958984,1.2275391-2.2158203,1.2275391Z"/>
                                    <polygon className="cls-1"
                                             points="15.2096501 15.7117589 13.6622258 15.7117589 14.0840398 16.972318 12.5112249 17.1608556 12.5112249 17.8112462 14.3647405 17.8112462 15.9252874 17.8112462 16.8666936 17.8112462 16.8666936 17.1608556 15.6536199 17.0143102 15.2096501 15.7117589"/>
                                </svg>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "ParagraphSideBar" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("ParagraphSideBar")}
                            >
                                <svg id="Effect_over" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m37.1189519,11.3418961c-2.0625,0-3.1630859.8808594-4.0478516,1.5888672-.8027344.6425781-1.4365234,1.1503906-2.796875,1.1503906-1.359375,0-1.9931641-.5078125-2.7958984-1.1503906-.8837891-.7080078-1.984375-1.5888672-4.0458984-1.5888672-2.0625,0-3.1640625.8808594-4.0488281,1.5888672-.8027344.6425781-1.4375,1.1503906-2.7988281,1.1503906-1.3623047,0-1.9970703-.5078125-2.8017578-1.1503906-.8847656-.7080078-1.9863281-1.5888672-4.0498047-1.5888672s-3.1650391.8808594-4.0498047,1.5888672c-.8046875.6425781-1.4394531,1.1503906-2.8017578,1.1503906-.5527344,0-1,.4472656-1,1s.4472656,1,1,1c2.0634766,0,3.1650391-.8808594,4.0498047-1.5888672.8046875-.6425781,1.4394531-1.1503906,2.8017578-1.1503906s1.9970703.5078125,2.8017578,1.1503906c.8847656.7080078,1.9863281,1.5888672,4.0498047,1.5888672,2.0625,0,3.1640625-.8808594,4.0488281-1.5888672.8027344-.6425781,1.4375-1.1503906,2.7988281-1.1503906,1.359375,0,1.9931641.5078125,2.7958984,1.1503906.8837891.7080078,1.984375,1.5888672,4.0458984,1.5888672s3.1621094-.8808594,4.046875-1.5888672c.8027344-.6425781,1.4375-1.1503906,2.7978516-1.1503906.5527344,0,1-.4472656,1-1s-.4472656-1-1-1Z"/>
                                </svg>
                                <svg id="Abc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m23.4324285,10.3418961c.144104,0,.2719116.0149536.4082642.0221558-.4049072-.2272339-.8555908-.3584595-1.3411865-.3584595-.8591309,0-1.6775513.3797607-2.4348755,1.2131348.8218994-.4812622,1.8844604-.8768311,3.3677979-.8768311Z"/>
                                    <path className="cls-1"
                                          d="m10.8115178,10.4261246l.5450439-1.6048584.6294556,1.8810425c.7678833.2662964,1.362854.644104,1.8621826,1.0153198l-1.600647-4.6959229h-1l-1.1478882,3.3400879c.2485352.0117188.4873047.0315552.711853.0643311Z"/>
                                    <path className="cls-1"
                                          d="m18.7377874,12.166359c.0076294-.0061035.0133667-.0101929.0210571-.0163574.3626099-.2902222.7774658-.6206665,1.2836304-.9194336v-2.8514404l.0644531-2.2705078-.2265625-.1298828-2.4521484.7202148v.5664062l1.3095703.1582031v4.7427979Z"/>
                                    <path className="cls-1"
                                          d="m28.1043035,12.1509171c.1564941.1252441.2932739.2315674.428894.3327637.3493042-1.1487427,1.1546021-1.7515259,2.1674805-1.7515259.2631226,0,.5565186.0438843.8613892.1315918l.2948608,1.0617676c.0487671.1972656.1270142.3644409.2391357.4962158.112915-.0863647.2225342-.1695557.3504639-.2719727.2480469-.1984863.5219116-.4156494.8309326-.6289062-.4255981-.8934326-1.4386597-1.5152588-2.6373291-1.5152588-1.2355347,0-2.3989258.6206665-3.081665,1.7226562.1937256.1446533.3779907.288208.5458374.4226685Z"/>
                                    <path className="cls-1"
                                          d="m24.0886785,14.4026261c-.1026001,1.8222046-1.0196533,2.7113647-2.0950317,2.7113647-.5965576,0-1.2493896-.270813-1.9033203-.9000854v-.093689c-.3926392.2423096-.8449707.4636841-1.3725586.6351318-.0015869.0899048-.0032959.1760864-.0050659.2611084l-1.2024536.2244873v.5712891l2.40625.1630859.1329956-1.0887451c.6882324.8653564,1.4415283,1.1346436,2.2078247,1.1346436,1.5455322,0,2.7711792-1.1165161,3.1531982-2.8979492-.4567261-.3609619-.815979-.6149292-1.3218384-.7206421Z"/>
                                    <path className="cls-1"
                                          d="m30.2742253,17.0811539c-1.0847778,0-1.9368896-.2163086-2.6424561-.5181274.6190186.9244995,1.6178589,1.4581909,2.8989868,1.4581909,1.3455811,0,2.3097534-.5869751,2.8150635-1.6591187-.7792969.4056396-1.7575684.7190552-3.0715942.7190552Z"/>
                                    <path className="cls-1"
                                          d="m13.9481145,16.5662003l.1359253.4061279-1.5728149.1885376v.6503906h4.3554688v-.6503906l-.9675293-.1168823c-.7648926-.0681763-1.4039917-.244873-1.9510498-.4777832Z"/>
                                    <path className="cls-1"
                                          d="m9.4733831,14.3658829c-.3131104.0223389-.5800171.0791016-.8106079.177002l-.829895,2.414856-1.3421631.2011719v.6523438h3.6679688v-.6523438l-1.5610352-.2146606.8757324-2.5783691Z"/>
                                </svg>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "UnderlineAnnotation" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("UnderlineAnnotation")}
                            >
                                <svg id="Abc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <rect className="cls-1" x="6.8442383" y="1.7756525" width="4" height="20.4486949"/>
                                </svg>
                                <svg id="Abc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m16.6923828,9.71875l.9736328-.1435547h.1816406l.9814453.1435547v.4511719h-2.1367188v-.4511719Zm2.7929688-5.9462891h.7871094l2.1835938,6.3974609h-1.2734375l-1.78125-5.4462891.2910156-.2460938-1.8945312,5.6923828h-.5107422l2.1982422-6.3974609Zm-1.0771484,3.9316406h2.5917969l.1845703.5009766h-2.9335938l.1572266-.5009766Zm1.75,2.0253906l1.1455078-.1435547h.4208984l1.2119141.1435547v.4404297h-2.7783203v-.4404297Z"/>
                                    <path className="cls-1"
                                          d="m23.3300781,9.78125l.9658203-.1923828-.3583984.5849609c.0185547-.4326172.0283203-1.4208984.0283203-2.015625v-4.1347656l-.6943359-.0859375v-.3710938l1.7148438-.4316406.1445312.0869141-.0380859,1.3525391v1.6494141l.0283203.1240234v3.0957031l-.1699219.84375-1.6210938-.1132812v-.3925781Zm3.8222656-1.8964844c0-1.1855469-.4453125-1.7626953-1.09375-1.7626953-.4267578,0-.8759766.34375-1.3789062.8544922l-.0869141-.1660156c.5537109-.9394531,1.1845703-1.3710938,1.9355469-1.3710938,1.03125,0,1.8515625.8525391,1.8515625,2.390625,0,1.5126953-.9082031,2.4755859-2.0097656,2.4755859-.7265625,0-1.2753906-.3759766-1.7421875-1.3701172l.0869141-.1679688c.4462891.5810547.8515625.8652344,1.3134766.8652344.6240234,0,1.1240234-.5634766,1.1240234-1.7480469Z"/>
                                    <path className="cls-1"
                                          d="m30.2890625,7.7519531c0,1.15625.5869141,1.7900391,1.4404297,1.7900391.5068359,0,.9228516-.2402344,1.2089844-.6396484l.2832031.2070312c-.3154297.7900391-.9677734,1.1962891-1.8740234,1.1962891-1.3115234,0-2.2666016-.8798828-2.2666016-2.421875,0-1.5390625,1.1083984-2.4443359,2.3984375-2.4443359.9355469,0,1.6455078.5810547,1.7421875,1.3193359-.0761719.2929688-.2490234.4287109-.5410156.4287109-.3486328,0-.5683594-.2128906-.625-.6748047l-.1630859-.7636719.5722656.3759766c-.3125-.1542969-.5996094-.2216797-.8857422-.2216797-.6914062,0-1.2900391.5849609-1.2900391,1.8486328Z"/>
                                    <path className="cls-1"
                                          d="m18.7128906,18.1337891c.3994141-.1298828,1.0429688-.3056641,1.5087891-.4033203v.3740234c-.4423828.1005859-.984375.2617188-1.2685547.3837891-.6455078.2587891-.8369141.6025391-.8369141.96875,0,.4941406.2939453.7060547.6757812.7060547.2578125,0,.4287109-.0996094.8818359-.4257812l.2910156-.2177734.1171875.1699219-.3417969.359375c-.5195312.5332031-.8320312.8164062-1.4736328.8164062-.7216797,0-1.2724609-.4208984-1.2724609-1.2138672,0-.6113281.3339844-1.0683594,1.71875-1.5175781Zm.9130859,1.7617188v-2.296875c0-.8955078-.2158203-1.1357422-.8388672-1.1357422-.2275391,0-.4941406.0283203-.8808594.1552734l.5244141-.3369141-.1582031.7441406c-.0546875.4619141-.2832031.6679688-.5986328.6679688-.3007812,0-.4931641-.1542969-.5410156-.4326172.1152344-.7646484.8574219-1.2617188,2.0322266-1.2617188,1.1123047,0,1.5957031.4863281,1.5957031,1.734375v2.0947266c0,.3085938.1054688.4306641.2841797.4306641.1318359,0,.2226562-.0693359.3320312-.2119141l.2236328.1904297c-.2304688.4453125-.53125.609375-.9882812.609375-.5908203,0-.9433594-.3632812-.9863281-.9511719Z"/>
                                    <path className="cls-1"
                                          d="m21.8994141,20.3408203l.9658203-.1923828-.3583984.5849609c.0185547-.4326172.0283203-1.4208984.0283203-2.015625v-4.1347656l-.6943359-.0859375v-.3710938l1.7148438-.4316406.1445312.0869141-.0380859,1.3525391v1.6494141l.0283203.1240234v3.0957031l-.1699219.84375-1.6210938-.1132812v-.3925781Zm3.8222656-1.8964844c0-1.1855469-.4453125-1.7626953-1.09375-1.7626953-.4267578,0-.8759766.34375-1.3789062.8544922l-.0869141-.1660156c.5537109-.9394531,1.1845703-1.3710938,1.9355469-1.3710938,1.03125,0,1.8515625.8525391,1.8515625,2.390625,0,1.5126953-.9082031,2.4755859-2.0097656,2.4755859-.7265625,0-1.2753906-.3759766-1.7421875-1.3701172l.0869141-.1679688c.4462891.5810547.8515625.8652344,1.3134766.8652344.6240234,0,1.1240234-.5634766,1.1240234-1.7480469Z"/>
                                    <path className="cls-1"
                                          d="m28.8583984,18.3115234c0,1.15625.5869141,1.7900391,1.4404297,1.7900391.5068359,0,.9228516-.2402344,1.2089844-.6396484l.2832031.2070312c-.3154297.7900391-.9677734,1.1962891-1.8740234,1.1962891-1.3115234,0-2.2666016-.8798828-2.2666016-2.421875,0-1.5390625,1.1083984-2.4443359,2.3984375-2.4443359.9355469,0,1.6455078.5810547,1.7421875,1.3193359-.0761719.2929688-.2490234.4287109-.5410156.4287109-.3486328,0-.5683594-.2128906-.625-.6748047l-.1630859-.7636719.5722656.3759766c-.3125-.1542969-.5996094-.2216797-.8857422-.2216797-.6914062,0-1.2900391.5839844-1.2900391,1.8486328Z"/>
                                </svg>
                            </div>
                        </div>
                        <div className={`demo-styles ${'demo-styles-' + selectedCategory}`}>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "PostIt" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                onClick={() => setCreatingComponent("PostIt")}
                            >
                                <svg id="Abc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m14.7621155,5.7306213h-.0355835c-.0840454.3287354-.1721802.6583862-.2648315.9871216-.0931396.3287964-.1871948.6520386-.2830811.9698486l-.2424927.807251h1.625061l-.2424927-.807251c-.0958862-.3178101-.1912842-.6410522-.2871704-.9698486-.0958862-.3287354-.1853638-.6583862-.2694092-.9871216Z"/>
                                    <path className="cls-1"
                                          d="m21.0722961,9.8418274c.2337646-.281311.350647-.6821899.350647-1.2026978,0-.4611816-.0903931-.826416-.2693481-1.0958252-.1799316-.2694092-.4666748-.4036255-.8620605-.4036255-.1790161,0-.368042.0465698-.5653076.1387939-.1972046.0931396-.3953857.2438354-.5926514.4538574v2.0738525c.1854248.1671143.3744507.2858276.5653076.3543091.1917725.0684814.3598022.1032104.5031738.1032104.3469849,0,.6373901-.140625.8702393-.421875Z"/>
                                    <path className="cls-1"
                                          d="m9.8811951,1.7756653v20.4486694h7.6378784c.4622192,0,.9182129-.1068115,1.3323364-.3120728l10.1555786-5.0338135c.1702271-.0844116.3248291-.19104.4609985-.3154907.2723389-.2488403.4707642-.5687866.572876-.9232788.0510254-.1772461.0779419-.3631592.0779419-.5531616V1.7756653H9.8811951Zm6.3886108,9.116333l-.5022583-1.6876221h-2.0464478l-.5027466,1.6876221h-.9158936l1.9391479-5.8800659h1.0415039l1.9382324,5.8800659h-.9515381Zm7.5950317-3.4381714c.227417-.3415527.527832-.6027222.9022827-.7854004.3734741-.1826172.7825928-.2739258,1.2254639-.2739258.3588867,0,.6730347.0611572.9424438.1835327.2694092.123291.4940186.2712402.6730347.4447632l-.4310303.5652466c-.1735229-.1433716-.3525391-.2556763-.5379028-.3360596-.1862793-.0812988-.3862915-.12146-.6018066-.12146-.4730225,0-.8574829.1433716-1.1533203.4310303-.296814.2867432-.4447632.6675415-.4447632,1.1396484,0,.4730835.1452026.8529663.4356079,1.140625.2904053.2867432.668457.4310303,1.1351318.4310303.263916,0,.5031738-.0511475.7186279-.1525269.2155151-.1022949.4100342-.2246704.5835571-.368042l.385376.5744019c-.244751.2155151-.5205078.3807983-.8255615.4977417-.3049927.1168823-.616394.175293-.9332275.175293-.4547729,0-.8648071-.0894775-1.2301025-.2694092-.3652954-.1798706-.6538696-.44104-.8666382-.7853394-.211853-.3442383-.3186646-.7588501-.3186646-1.2437744,0-.4903564.1141357-.9058838.3414917-1.2473755Zm-4.8389893,2.9532471l-.0803833.4849243h-.7004395v-6.3649902h.8885498v1.687561l-.0355835.8082275h.0264893c.1917725-.1917725.4118042-.3442993.6602173-.4575195.2484131-.1141357.4949341-.1707764.7406006-.1707764.579895,0,1.0273438.2036133,1.3414917.6099854.3141479.4072876.4711914.9488525.4711914,1.6254883,0,.4968262-.0922241.9232788-.2775879,1.2794189s-.4282837.6264648-.7278442.8118286c-.298584.1853638-.6191406.2785034-.9597778.2785034-.210022,0-.4328003-.052063-.6693726-.1570435-.2365112-.1050415-.4529419-.2502441-.6501465-.4356079h-.0274048Zm.1044312,10.2508545l3.0915527-5.3305664,6.1033936.7728882-9.1949463,4.5576782Z"/>
                                </svg>
                            </div>
                            <div
                                className={`demo-tool demo-add-post-it ${creatingComponent === "TinyText" ? "demo-add-tool-active-" + selectedCategory : ""} ${'demo-tool-' + selectedCategory}`}
                                id="add-post-it-yellow"
                                onClick={() => setCreatingComponent("TinyText")}
                            >
                                <svg id="Abc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24">
                                    <path className="cls-1"
                                          d="m12.5390733,17.6000682l3.5356445-10.4960938h1.5039062l3.5361328,10.4960938h-1.4077148l-.9921875-3.2001953h-3.8081055l-1.0078125,3.2001953h-1.3598633Zm3.199707-5.8720703l-.4960938,1.5996094h3.1362305l-.4960938-1.5996094c-.1816406-.5869141-.3598633-1.1708984-.5361328-1.7519531-.1757812-.5810547-.34375-1.1757812-.5039062-1.7841797h-.0639648c-.1708984.6083984-.3413086,1.203125-.5117188,1.7841797-.1708984.5810547-.347168,1.1650391-.5283203,1.7519531Z"/>
                                    <polygon className="cls-1"
                                             points="27.4609267 5.6547852 27.4609267 4.6547852 22.417958 4.6547852 22.417958 5.6547852 24.4394424 5.6547852 24.4394424 18.3452148 22.417958 18.3452148 22.417958 19.3452148 27.4609267 19.3452148 27.4609267 18.3452148 25.4394424 18.3452148 25.4394424 5.6547852 27.4609267 5.6547852"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </nav>
            </section>
        </div>
    );
}

class Core extends Component<> {

    state = {
        url: initialUrl.url,
        highlights: [],
    };

    render() {
        const {url} = this.state;
        return (
            <PdfLoader url={url} beforeLoad={() => {
            }}>
                {(pdfDocument) => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        onScrollChange={null}
                        enableAreaSelection={(event) => null}
                        onSelectionFinished={(event) => null}
                        pdfScaleValue={1.39}
                        scrollRef={null}
                        highlights={[]}
                    />
                )}
            </PdfLoader>
        );
    }
}

export default Demo;