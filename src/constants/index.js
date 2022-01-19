export const ALLOW = "reprolib:terms/allow";
export const ABOUT = "reprolib:terms/landingPage";
export const ABOUT_CONTENT = "reprolib:terms/landingPageContent";
export const ABOUT_TYPE = "reprolib:terms/landingPageType";
export const ALT_LABEL = "http://www.w3.org/2004/02/skos/core#altLabel";
export const AUDIO_OBJECT = "schema:AudioObject";
export const AUTO_ADVANCE = "reprolib:terms/auto_advance";
export const BACK_DISABLED = "reprolib:terms/disable_back";
export const COLOR_PALETTE = "reprolib:terms/colorPalette";
export const CONTENT_URL = "schema:contentUrl";
export const DELAY = "reprolib:terms/delay";
export const DESCRIPTION = "schema:description";
export const SPLASH = "schema:splash";
export const DO_NOT_KNOW = "reprolib:terms/dont_know_answer";
export const ENCODING_FORMAT = "schema:encodingFormat";
export const FULL_SCREEN = "reprolib:terms/full_screen";
export const IMAGE = "schema:image";
export const WATERMARK = "schema:watermark";
export const IMAGE_OBJECT = "schema:ImageObject";
export const INPUT_TYPE = "reprolib:terms/inputType";
export const INPUTS = "reprolib:terms/inputs";
export const IS_ABOUT = "reprolib:terms/isAbout";
export const ITEM_LIST_ELEMENT = "schema:itemListElement";
export const MAX_VALUE = "schema:maxValue";
export const MEDIA = "reprolib:terms/media";
export const MIN_VALUE = "schema:minValue";
export const MIN_AGE = "schema:minAge";
export const MAX_AGE = "schema:maxAge";
export const MULTIPLE_CHOICE = "reprolib:terms/multipleChoice";
export const MIN_VALUE_IMAGE = "schema:minValueImg";
export const MAX_VALUE_IMAGE = "schema:maxValueImg";
export const SLIDER_LABEL = "schema:sliderLabel";
export const SCORING = "reprolib:terms/scoring";
export const ITEM_LIST = "reprolib:terms/itemList";
export const ITEM_OPTIONS = "reprolib:terms/itemOptions";
export const OPTIONS = "reprolib:terms/options";
export const SLIDER_OPTIONS = "reprolib:terms/sliderOptions";
export const VALUE_TYPE = "reprolib:terms/valueType";
export const ENABLE_NEGATIVE_TOKENS = "reprolib:terms/enableNegativeTokens";
export const NAME = "schema:name";
export const PREAMBLE = "reprolib:terms/preamble";
export const PREF_LABEL = "http://www.w3.org/2004/02/skos/core#prefLabel";
export const QUESTION = "schema:question";
export const REFUSE_TO_ANSWER = "reprolib:terms/refused_to_answer";
export const REQUIRED_VALUE = "reprolib:terms/required";
export const SCHEMA_VERSION = "schema:schemaVersion";
export const SCORING_LOGIC = "reprolib:terms/scoringLogic";
export const SHUFFLE = "reprolib:terms/shuffle";
export const ISPRIZE = "reprolib:terms/isPrize";
export const TIMER = "reprolib:terms/timer";
export const TRANSCRIPT = "schema:transcript";
export const URL = "schema:url";
export const VALUE = "schema:value";
export const COLOR = "schema:color";
export const PRICE = "schema:price";
export const SCORE = "schema:score";
export const ALERT = "schema:alert";
export const CORRECT_ANSWER = "schema:correctAnswer";
export const RESPONSE_OPTIONS = "reprolib:terms/responseOptions";
export const VARIABLE_NAME = "reprolib:terms/variableName";
export const JS_EXPRESSION = "reprolib:terms/jsExpression";
export const SCORE_OVERVIEW = "reprolib:terms/scoreOverview";
export const DIRECTION = "reprolib:terms/direction";
export const VERSION = "schema:version";
export const IS_VIS = "reprolib:terms/isVis";
export const ADD_PROPERTIES = "reprolib:terms/addProperties";
export const COMPUTE = "reprolib:terms/compute";
export const SUBSCALES = "reprolib:terms/subScales";
export const FINAL_SUBSCALE = "reprolib:terms/finalSubScale";
export const IS_AVERAGE_SCORE = "reprolib:terms/isAverageScore";
export const MESSAGES = "reprolib:terms/messages";
export const MESSAGE = "reprolib:terms/message";
export const LOOKUP_TABLE = "reprolib:terms/lookupTable";
export const AGE = "reprolib:terms/age";
export const RAW_SCORE = "reprolib:terms/rawScore";
export const SEX = "reprolib:terms/sex";
export const T_SCORE = "reprolib:terms/tScore";
export const OUTPUT_TEXT = "reprolib:terms/outputText";
export const OUTPUT_TYPE = "reprolib:terms/outputType";
export const RESPONSE_ALERT = "reprolib:terms/responseAlert";
export const RANDOMIZE_OPTIONS = "reprolib:terms/randomizeOptions";
export const CONTINOUS_SLIDER = "reprolib:terms/continousSlider";
export const SHOW_TICK_MARKS = "reprolib:terms/showTickMarks";
export const IS_OPTIONAL_TEXT = "reprolib:terms/isOptionalText";
export const IS_OPTIONAL_TEXT_REQUIRED = "reprolib:terms/isOptionalTextRequired";
export const RESPONSE_ALERT_MESSAGE = "schema:responseAlertMessage";
export const MIN_ALERT_VALUE = "schema:minAlertValue";
export const MAX_ALERT_VALUE = "schema:maxAlertValue";
export const ORDER = "reprolib:terms/order";
export const HAS_RESPONSE_IDENTIFIER = "reprolib:terms/hasResponseIdentifier";
export const IS_RESPONSE_IDENTIFIER = "reprolib:terms/isResponseIdentifier";
export const IS_REVIEWER_ACTIVITY = "reprolib:terms/isReviewerActivity";
export const DISABLE_SUMMARY = "reprolib:terms/disable_summary";
export const NEXT_ACTIVITY = "reprolib:terms/nextActivity";
export const REMOVE_BACK_OPTION = "reprolib:terms/removeBackOption";
export const IS_ONE_PAGE_ASSESSMENT = "reprolib:terms/isOnePageAssessment";

export const Statuses = {
  LOADING: 'loading',
  READY: 'ready',
  ALREADY_ACCEPTED: 'already_accepted',
  ERROR: 'error',
  SUBMITTED: 'submitted',
  ACCEPTED: 'accepted',
  REMOVED: 'removed',
  DECLINED: 'declined'
}
export const ConsentMode = {
  SIGNUP: 'SignUp',
  LOGIN: 'LogIn'
}
export const Languages = {
  ENGLISH: 'en',
  FRENCH: 'fr'
}
export const steps = [
  {
    title: 'About the Study',
    image: 'https://parkinsonmpower.org/static/images/about%20the%20study.svg',
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu sagittis leo,
    sit amet consectetur mi. Donec volutpat rutrum massa et luctus.
    Fusce ac dui quam. Nam a nibh porttitor, tincidunt libero id, condimentum velit.
    Praesent ultricies consectetur nulla vel pharetra. Fusce auctor viverra fringilla.
    Duis euismod enim eu quam tincidunt, sed faucibus leo placerat.
    Pellentesque et justo a orci dictum pulvinar eleifend at nisl. Integer eu purus sapien.`
  },
  {
    title: 'How does the study work?',
    image:
      'https://parkinsonmpower.org/static/images/procedures%20activities.svg',
    text: `Integer vel diam a lorem mattis tristique at vel magna. Etiam nunc nunc,
    vehicula in mauris vel, gravida pellentesque leo. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit. Quisque orci elit, mollis at massa non, tempor
    posuere turpis. Sed lacinia eros orci, quis efficitur justo euismod eget.
    In ornare vel nisi at fringilla.
    `
  },
  {
    title: 'How long does it last?',
    image:
      'https://parkinsonmpower.org/static/images/how%20long%20does%20it%20last.svg',
    text: `<p>We will ask you to participate for 2 weeks every three months.</p>
    <p>We would like you to participate for 2 years, but you can participate as long as you like.</p>`
  },
  {
    title: 'What are the benefits and risks?',
    image:
      'https://parkinsonmpower.org/static/images/benefits%20and%20risks.svg',
    text: `Integer vel diam a lorem mattis tristique at vel magna. Etiam nunc nunc,
    vehicula in mauris vel, gravida pellentesque leo. Lorem ipsum dolor sit amet,
    consectetur adipiscing elit. Quisque orci elit, mollis at massa non, tempor
    posuere turpis. Sed lacinia eros orci, quis efficitur justo euismod eget.
    In ornare vel nisi at fringilla.`
  }
]

export const fullConsentForm = {
  fullConsentForm: `
<div id="terms"><h4 style="text-align: center;">
UNIVERSITY OF SOMEWHERE
CONSENT FORM
</h4> <h5 style="text-align: center;">Crowdsourcing Image Segmentation</h5> <br> <h6>RESEARCHERS:</h6> <p>Someone Cool<br>
University of Somewhere eScience Institute and Institute for Neuroengineering<br> <a href="#">someone@us.edu</a></p> <p>Someone Nice<br>
University of Somewhere Institute for Neuroengineering<br> <a href="#">jjb@us.edu</a></p> <p>Someone Fun<br>
University of Somewhere eScience Institute<br> <a href="#">someone@us.edu</a></p> <h6>RESEARCHER’S STATEMENT:</h6> <p>  We are asking you to be in a research study.  The purpose of this consent form is to give you the information you will need to help you decide whether to be in the study or not.  Please read the form carefully.  You may ask questions about the purpose of the research, what we would ask you to do, the possible risks and benefits, your rights as a volunteer, and anything else about the research or this form that is not clear. Please reach out to a member of the Matter Lab if you have any questions. When we have answered all your questions, you can decide if you want to be in the study or not.  This process is called “informed consent.”
</p> <h6>PURPOSE OF THE STUDY</h6> <p>Image annotation is needed to extract data from images. The purpose of this study is to train better computer algorithms to annotate images, and also correct any errors the computer makes. We aim to 1) collect image annotation data from you, and 2) combine annotations from many users into the most accurate annotation. This information will be used to train new computer algorithms.
</p> <h6>STUDY PROCEDURES</h6> <p>You will be asked to log in. You may be given the option to use an existing social media login (e.g. Twitter, Facebook, Google, etc.), and you may be asked to create a an anonymous username to be displayed to the public. You may also choose to include your social media avatar to display alongside your anonymous username in the public leaderboard. Alternatively, you may also have the option to use an anonymous login. You may provide your email when you sign up for an account if you wish to be contacted about future work related to this task.</p> <p>You will be given instructions on how to annotate images for a particular task. Try your best to annotate the images as quickly and accurately as you can. You may complete however many tasks you wish. Each task can take anywhere from 30 seconds to 5 minutes. You may stop annotating at any time.
</p> <p>You may use any device with a web browser (computer, tablet, or phone). We will record all settings you use on the application, your annotations, your screen resolution, and your anonymous username. This data will be made publically available to researchers.
</p> <h6>RISKS, STRESS, OR DISCOMFORT</h6> <p>Some people feel that providing information for research or having the research session recorded is an invasion of privacy. If you wish to remain anonymous, we recommend creating an anonymous nickname that does not include any identifiers relating to you.
</p> <h6>BENEFITS OF THE STUDY</h6> <p>This study will help us to extract accurate data from images. This information will be used for scientific research.
</p> <h6>CONFIDENTIALITY OF RESEARCH INFORMATION</h6> <p>Your social media login information (such as username and email address), if provided, will remain confidential and will not be shared outside the study team.
Government or university staff sometimes review studies such as this one to make sure they are being done safely and legally.  If a review of this study takes place, your records may be examined.  The reviewers will protect your privacy.  The study records will not be used to put you at legal risk of harm.
</p> <h6>RESEARCH-RELATED INJURY</h6> <p>If you think you have been harmed from being in this research, contact Someone Cool at <a href="#">someone@us.edu.</a></p> <p>* Please note that we cannot ensure the confidentiality of information sent via e-mail.
</p> <h6>SUBJECT’S STATEMENT</h6> <p>This study has been explained to me, and I understand the procedures, benefits, and risks of this study.  I affirm that I am capable of consenting on my own behalf, that I am age 18 or older, and I volunteer to take part in this research.  I have had a chance to ask questions.  If I have questions later about the research, or if I have been harmed by participating in this study, I can contact one of the researchers listed on the first page of this consent form.  If I have questions about my rights as a research subject, I can call the Human Subjects Division.
</p></div>
`
}
