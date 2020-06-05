from django.db import models
from django.contrib.postgres.fields import JSONField


class Organization(models.Model):
    class Meta:
        db_table = 'Organizations'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    vat = models.CharField(null=True, blank=True, max_length=255, db_column='VAT')
    main_firstname = models.CharField(null=True, blank=True, max_length=255)
    main_lastname = models.CharField(null=True, blank=True, max_length=255)
    main_address = models.CharField(null=True, blank=True, max_length=255)
    main_phone = models.CharField(null=True, blank=True, max_length=255)
    main_email = models.CharField(null=True, blank=True, max_length=255)
    inv_firstname = models.CharField(null=True, blank=True, max_length=255)
    inv_lastname = models.CharField(null=True, blank=True, max_length=255)
    inv_address = models.CharField(null=True, blank=True, max_length=255)
    inv_phone = models.CharField(null=True, blank=True, max_length=255)
    inv_email = models.CharField(null=True, blank=True, max_length=255)


class User(models.Model):
    class Meta:
        db_table = 'Users'
    id = models.BigAutoField(primary_key=True)
    time_created = models.DateTimeField(null=True, blank=True)
    organization = models.ForeignKey(Organization, models.PROTECT, db_column='organizationId')
    firstname = models.CharField(null=True, blank=True, max_length=255)
    lastname = models.CharField(null=True, blank=True, max_length=255)
    address = models.CharField(null=True, blank=True, max_length=255)
    phone = models.CharField(null=True, blank=True, max_length=255)
    email = models.CharField(null=True, blank=True, max_length=255)
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    username = models.CharField(null=True, blank=True, max_length=255)
    password = models.CharField(null=True, blank=True, max_length=255)
    user_level = models.CharField(null=True, blank=True, max_length=255)


class License(models.Model):
    class Meta:
        db_table = 'Licenses'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    type = models.IntegerField(null=True, blank=True)
    price = models.CharField(null=True, blank=True, max_length=255)
    user = models.ForeignKey(User, models.PROTECT, db_column="userId")
    next_payment = models.DateTimeField(null=True, blank=True, db_column='nextPayment')
    purchase_date = models.DateTimeField(null=True, blank=True, db_column='purchaseDate')
    termination_date = models.DateTimeField(null=True, blank=True, db_column='terminationDate')


class Ecosystem(models.Model):
    class Meta:
        db_table = 'Ecosystems'
    id = models.BigAutoField(primary_key=True)
    organization = models.ForeignKey(Organization, models.PROTECT, db_column="organizationId")


class FeatureModel(models.Model):
    class Meta:
        db_table = 'FeatureModels'
    id = models.BigAutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    alg_class_sequence = JSONField(null=True, blank=True, db_column='algClassSequenceJSON')
    input_device_class_reqs = JSONField(null=True, blank=True, db_column='inputDeviceClassReqsJSON')
    input_device_param_reqs = JSONField(null=True, blank=True, db_column='inputDeviceParamReqsJSON')
    high_level_reqs = JSONField(null=True, blank=True, db_column='highLevelReqsJSON')
    version = models.IntegerField(null=True, blank=True)


class Project(models.Model):
    class Meta:
        db_table = 'Projects'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    decription = models.CharField(null=True, blank=True, max_length=255)
    organization = models.ForeignKey(Organization, models.PROTECT, db_column="organizationId")
    ecosystem = models.ForeignKey(Ecosystem, models.PROTECT, db_column="ecosystemId")
    featuremodel = models.ForeignKey(FeatureModel, models.PROTECT, db_column="featuremodelId")
    status = models.CharField(null=True, blank=True, max_length=255)
    settings = JSONField(null=True, blank=True, db_column='settingsJSON')


class DockerModel(models.Model):
    class Meta:
        db_table = 'DockerModels'
    id = models.BigAutoField(primary_key=True)
    docker_payload = models.TextField(null=True, blank=True, db_column='dockerPayload')
    version = models.IntegerField(null=True, blank=True)
    feature_models = models.ManyToManyField(FeatureModel, through='DockerModelFeatureModel')


class DockerModelFeatureModel(models.Model):
    class Meta:
        db_table = 'DockerModelFeatureModel'
    docker_model = models.ForeignKey(DockerModel, models.PROTECT, db_column='dockerModelId')
    feature_model = models.ForeignKey(FeatureModel, models.PROTECT, db_column='featureModelId')


class DockerInstance(models.Model):
    class Meta:
        db_table = 'DockerInstances'
    id = models.BigAutoField(primary_key=True)
    docker_model = models.ForeignKey(DockerModel, models.PROTECT, db_column="dockerModelId")
    version = models.IntegerField(null=True, blank=True)


class EdgeNode(models.Model):
    class Meta:
        db_table = 'EdgeNodes'
    id = models.BigAutoField(primary_key=True)
    organization = models.ForeignKey(Organization, models.PROTECT, db_column="organizationId")
    feature_models = JSONField(null=True, blank=True, db_column='featureModelsJSON')
    feature_instances = JSONField(null=True, blank=True, db_column='featureInstancesJSON')
    docker_instance = models.ForeignKey(DockerInstance, models.PROTECT, db_column="dockerInstanceId")
    projects = models.ManyToManyField(Project, through='ProjectEdgeNode')
    ecosystems = models.ManyToManyField(Ecosystem, through='EcosystemsEdgeNode')


class EcosystemsEdgeNode(models.Model):
    class Meta:
        db_table = 'EcosystemsEdgeNodes'

    ecosystem = models.ForeignKey(Ecosystem, models.PROTECT, db_column='ecosystemId')
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column='edgeNodeId')


class ProjectEdgeNode(models.Model):
    class Meta:
        db_table = 'ProjectEdgeNodes'
    project = models.ForeignKey(Project, models.PROTECT, db_column='projectId')
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column='edgeNodeId')


class DeviceParameter(models.Model):
    class Meta:
        db_table = 'DeviceParameters'
    id = models.BigAutoField(primary_key=True)
    is_sensor = models.BooleanField(null=True, blank=True, db_column='isSensor')
    is_ECU = models.BooleanField(null=True, blank=True, db_column='isECU')
    is_camera = models.BooleanField(null=True, blank=True, db_column='isCamera')
    is_lidar = models.BooleanField(null=True, blank=True, db_column='isLidar')
    is_illu = models.BooleanField(null=True, blank=True, db_column='isIllu')
    is_thermal = models.BooleanField(null=True, blank=True, db_column='isThermal')
    is_radar = models.BooleanField(null=True, blank=True, db_column='isRadar')
    model_number = models.IntegerField(null=True, blank=True, db_column='modelNumber')
    manufacturer = models.CharField(null=True, blank=True, max_length=255)
    name = models.CharField(null=True, blank=True, max_length=255)
    email = models.CharField(null=True, blank=True, max_length=255)
    phone = models.IntegerField(null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)
    DDP_fin = models.IntegerField(null=True, blank=True, db_column='DDPfin')
    IP_code = models.CharField(null=True, blank=True, max_length=255, db_column='IPcode')
    power_consumption = models.IntegerField(null=True, blank=True, db_column='powerConsumption')
    device_size_x = models.IntegerField(null=True, blank=True, db_column='deviceSizeX')
    device_size_y = models.IntegerField(null=True, blank=True, db_column='deviceSizeY')
    device_size_z = models.IntegerField(null=True, blank=True, db_column='deviceSizeZ')
    integrated_measures = JSONField(null=True, blank=True, db_column='integratedMeasuresJSON')
    camera_data = JSONField(null=True, blank=True, db_column='cameraDataJSON')
    ECU_data = JSONField(null=True, blank=True, db_column='ECUDataJSON')
    lidar_data = JSONField(null=True, blank=True, db_column='lidarDataJSON')
    illum_data = JSONField(null=True, blank=True, db_column='illumDataJSON')
    thermal_data = JSONField(null=True, blank=True, db_column='thermalDataJSON')
    radar_data = JSONField(null=True, blank=True, db_column='radarDataJSON')


class DeviceClass(models.Model):
    class Meta:
        db_table = 'DeviceClasses'
    id = models.BigAutoField(primary_key=True)
    docker_base = models.CharField(null=True, blank=True, max_length=255, db_column='dockerBase')
    device_parameter = models.ForeignKey(DeviceParameter, models.PROTECT, db_column="deviceParameterId")
    docker_models = models.ManyToManyField(DockerModel, through='DockerModelDeviceClass')


class DockerModelDeviceClass(models.Model):
    class Meta:
        db_table = 'DockerModelDeviceClasses'
    docker_model = models.ForeignKey(DockerModel, models.PROTECT, db_column='dockerModelId')
    device_class = models.ForeignKey(DeviceClass, models.PROTECT, db_column='deviceClassId')
    type = models.CharField(null=True, blank=True, max_length=255)


class DeviceInstance(models.Model):
    class Meta:
        db_table = 'DeviceInstances'
    id = models.BigAutoField(primary_key=True)
    device_class = models.ForeignKey(DeviceClass, models.PROTECT, db_column="deviceClassId")
    serial = models.IntegerField(null=True, blank=True)
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')
    edge_nodes = models.ManyToManyField(EdgeNode, through='EdgeNodeDevice')


class EdgeNodeDevice(models.Model):
    class Meta:
        db_table = 'EdgeNodeDevices'
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column='edgeNodeId')
    device_instance = models.ForeignKey(DeviceInstance, models.PROTECT, db_column='deviceInstanceId')
    type = models.CharField(null=True, blank=True, max_length=255)


class FeatureInstance(models.Model):
    class Meta:
        db_table = 'FeatureInstances'
    id = models.BigAutoField(primary_key=True)
    project = models.ForeignKey(Project, models.PROTECT, db_column="projectId")
    feature_model = models.ForeignKey(FeatureModel, models.PROTECT, db_column="featureModelId")
    high_level_fidelity = JSONField(null=True, blank=True, db_column='highLevelFidelityJSON')
    total_comp_time = models.IntegerField(null=True, blank=True, db_column='totalCompTime')
    parent_ECU_class = models.ForeignKey(DeviceClass, models.PROTECT, db_column="parentECUclass")
    version = models.IntegerField(null=True, blank=True)


class Architecture(models.Model):
    class Meta:
        db_table = 'Architectures'
    id = models.BigAutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    payload = models.TextField(null=True, blank=True)
    version = models.IntegerField(null=True, blank=True)


class Weight(models.Model):
    class Meta:
        db_table = 'Weights'
    id = models.BigAutoField(primary_key=True)
    payload = models.TextField(null=True, blank=True)
    version = models.IntegerField(null=True, blank=True)


class AlgorithmModel(models.Model):
    class Meta:
        db_table = 'AlgorithmModels'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    description = models.TextField(null=True, blank=True)
    preprocessor = models.CharField(null=True, blank=True, max_length=255)
    architecture = models.ForeignKey(Architecture, models.PROTECT, db_column="architectureId")
    postprocessor = models.CharField(null=True, blank=True, max_length=255)
    payload = models.TextField(null=True, blank=True)
    hyperparameter_structure = JSONField(null=True, blank=True, db_column='HyperparameterStructureJSON')
    validation_structure = JSONField(null=True, blank=True, db_column='ValidationStructureJSON')
    model_class = models.BooleanField(null=True, blank=True, db_column='class')
    is_trainable = models.BooleanField(null=True, blank=True, db_column='isTrainable')
    init_weight = models.ForeignKey(Weight, models.PROTECT, db_column="initWeights")
    version = models.IntegerField(null=True, blank=True)
    feature_models = models.ManyToManyField(FeatureModel, through='FeatureModelAlgorithm')


class FeatureModelAlgorithm(models.Model):
    class Meta:
        db_table = 'FeatureModelAlgorithm'
    feature_model = models.ForeignKey(FeatureModel, models.PROTECT, db_column='featureModelId')
    algorithm_model = models.ForeignKey(AlgorithmModel, models.PROTECT, db_column='algorithmModelId')


class ValidationInstruction(models.Model):
    class Meta:
        db_table = 'ValidationInstructions'
    id = models.BigAutoField(primary_key=True)
    metadata = JSONField(null=True, blank=True, db_column='metadataJSON')


class DataSplitInstruction(models.Model):
    class Meta:
        db_table = 'DataSplitInstructions'
    id = models.BigAutoField(primary_key=True)
    metadata = JSONField(null=True, blank=True, db_column='metadataJSON')


class TrainingInstruction(models.Model):
    class Meta:
        db_table = 'TrainingInstructions'
    id = models.BigAutoField(primary_key=True)
    data_split_inst = models.ForeignKey(DataSplitInstruction, models.PROTECT, db_column="dataSplitInst")
    hyperparameters = JSONField(null=True, blank=True, db_column='hyperparametersJSON')


class AlgorithmInstance(models.Model):
    class Meta:
        db_table = 'AlgorithmInstances'
    id = models.BigAutoField(primary_key=True)
    project = models.ForeignKey(Project, models.PROTECT, db_column="projectId")
    algorithm_model = models.ForeignKey(AlgorithmModel, models.PROTECT, db_column="algorithmModelId")
    weight = models.ForeignKey(Weight, models.PROTECT, db_column="weightId")
    version = models.IntegerField(null=True, blank=True)
    status = models.CharField(null=True, blank=True, max_length=255)
    current_validation = JSONField(null=True, blank=True, db_column='currentValidationJSON')
    progress_percentage = models.IntegerField(null=True, blank=True, db_column='progressPercentage')
    validation_history = JSONField(null=True, blank=True, db_column='validationHistoryJSON')
    creation_date = models.DateTimeField(null=True, blank=True, db_column='creationDate')
    training_log = models.CharField(null=True, blank=True, max_length=255, db_column='trainingLog')
    device_instances = models.ManyToManyField(DeviceInstance, through='AlgorithmInstanceDeployedDevice')
    feature_instances = models.ManyToManyField(FeatureInstance, through='FeatureInstanceAlgorithm')
    training_instructions = models.ManyToManyField(TrainingInstruction, through='AlgorithmInstanceTrainingInst')


class AlgorithmInstanceTrainingInst(models.Model):
    class Meta:
        db_table = 'AlgorithmInstanceTrainingInst'
    algorithm_instance = models.ForeignKey(AlgorithmInstance, models.PROTECT, db_column='algorithmInstanceId')
    training_instruction = models.ForeignKey(TrainingInstruction, models.PROTECT, db_column='trainingInstructionId')


class FeatureInstanceAlgorithm(models.Model):
    class Meta:
        db_table = 'FeatureInstanceAlgorithm'
    feature_instance = models.ForeignKey(FeatureInstance, models.PROTECT, db_column='featureInstanceId')
    algorithm = models.ForeignKey(AlgorithmInstance, models.PROTECT, db_column='algorithmId')


class AlgorithmInstanceDeployedDevice(models.Model):
    class Meta:
        db_table = 'AlgorithmInstanceDeployedDevices'

    algorithm_instance = models.ForeignKey(AlgorithmInstance, models.PROTECT, db_column='algorithmInstanceId')
    deployed_device_instance = models.ForeignKey(DeviceInstance, models.PROTECT, db_column='deployedDeviceInstanceId')


class ObjectModel(models.Model):
    class Meta:
        db_table = 'ObjectModels'
    id = models.BigAutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    object_file = models.CharField(null=True, blank=True, max_length=255, db_column='objectFile')
    version = models.IntegerField(null=True, blank=True)
    algorithm_instances = models.ManyToManyField(AlgorithmInstance, through='AlgorithmInstanceObjectModel')
    projects = models.ManyToManyField(Project, through='ObjectModelProject')
    feature_models = models.ManyToManyField(FeatureModel, through='ObjectModelFeatureModel')
    algorithm_models = models.ManyToManyField(AlgorithmModel, through='ObjectModelAlgorithmModel')


class ObjectModelAlgorithmModel(models.Model):
    class Meta:
        db_table = 'ObjectModelAlgorithmModel'
    object_model = models.ForeignKey(ObjectModel, models.PROTECT, db_column='objectModelId')
    algorithm_model = models.ForeignKey(AlgorithmModel, models.PROTECT, db_column='algorithmModelId')


class ObjectModelFeatureModel(models.Model):
    class Meta:
        db_table = 'ObjectModelFeatureModel'
    object_model = models.ForeignKey(ObjectModel, models.PROTECT, db_column='objectModelId')
    feature_model = models.ForeignKey(FeatureModel, models.PROTECT, db_column='featureModelId')


class ObjectModelProject(models.Model):
    class Meta:
        db_table = 'ObjectModelProject'
    object_model = models.ForeignKey(ObjectModel, models.PROTECT, db_column='objectModelId')
    project = models.ForeignKey(Project, models.PROTECT, db_column='projectId')


class AlgorithmInstanceObjectModel(models.Model):
    class Meta:
        db_table = 'AlgorithmInstanceObjectModel'
    algorithm_instance = models.ForeignKey(AlgorithmInstance, models.PROTECT, db_column='algorithmInstanceId')
    object_model = models.ForeignKey(ObjectModel, models.PROTECT, db_column='objectModelId')


class DataAcqInstruction(models.Model):
    class Meta:
        db_table = 'DataAcqInstructions'
    id = models.BigAutoField(primary_key=True)
    video_download = models.BooleanField(null=True, blank=True, db_column='videoDownload')
    video_download_params = JSONField(null=True, blank=True, db_column='videoDownloadParamsJSON')
    real_data_params = JSONField(null=True, blank=True, db_column='realDataParamsJSON')
    SDG_one = models.BooleanField(null=True, blank=True, db_column='SDGone')
    SDG_one_params = JSONField(null=True, blank=True, db_column='SDGoneParamsJSON')


class AnnotationInstruction(models.Model):
    class Meta:
        db_table = 'AnnotationInstructions'
    id = models.BigAutoField(primary_key=True)
    outsourced_meta = JSONField(null=True, blank=True, db_column='outsourcedMetaJSON')
    SDG_two = models.BooleanField(null=True, blank=True, db_column='SDGtwo')
    SDG_two_inst = JSONField(null=True, blank=True, db_column='SDGtwoInstJSON')


class FrameDataset(models.Model):
    class Meta:
        db_table = 'FrameDatasets'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    is_continuous = models.BooleanField(null=True, blank=True, db_column='isContinuous')
    time_start = models.IntegerField(null=True, blank=True, db_column='timeStart')
    time_end = models.IntegerField(null=True, blank=True, db_column='timeEnd')
    is_labeled = models.BooleanField(null=True, blank=True, db_column='isLabeled')
    VDL_is_downloaded = models.BooleanField(null=True, blank=True, db_column='VDLisDownloaded')
    VDL_address = models.CharField(null=True, blank=True, max_length=255, db_column='VDLaddress')
    VDL_timestamp_found = models.DateTimeField(null=True, blank=True, db_column='VDLtimestampFound')
    data_acq_instruction = models.ForeignKey(DataAcqInstruction, models.PROTECT, db_column='DataAcqInstructionsId')
    aug_metadata = JSONField(null=True, blank=True, db_column='augMetadataJSON')
    projects = models.ManyToManyField(Project, through='FrameDatasetsProject')


class FrameDatasetsProject(models.Model):
    class Meta:
        db_table = 'FrameDatasetsProjects'
    frame_dataset = models.ForeignKey(FrameDataset, models.PROTECT, db_column='frameDatasetId')
    project = models.ForeignKey(Project, models.PROTECT, db_column='projectId')


class AugmentationInstruction(models.Model):
    class Meta:
        db_table = 'AugmentationInstructions'
    id = models.BigAutoField(primary_key=True)
    frame_dataset = models.ForeignKey(FrameDataset, models.PROTECT, db_column="frameDatasetId")
    project = models.ForeignKey(Project, models.PROTECT, db_column="projectId")
    aug_operations = JSONField(null=True, blank=True, db_column='augOperationsJSON')


class ProjectInstruction(models.Model):
    class Meta:
        db_table = 'ProjectInstructions'
    id = models.BigAutoField(primary_key=True)
    project = models.ForeignKey(Project, models.PROTECT, db_column="projectId")
    data_acq_inst = models.ForeignKey(DataAcqInstruction, models.PROTECT, db_column="dataAcqInstId")
    annot_inst = models.ForeignKey(AnnotationInstruction, models.PROTECT, db_column="annotInstId")
    augment_inst = models.ForeignKey(AugmentationInstruction, models.PROTECT, db_column="augmentInstId")
    training_inst = models.ForeignKey(TrainingInstruction, models.PROTECT, db_column="trainingInstrId")
    validation_inst = models.ForeignKey(ValidationInstruction, models.PROTECT, db_column="validationInstrId")
    version = models.IntegerField(null=True, blank=True)


class LabelClass(models.Model):
    class Meta:
        db_table = 'LabelClasses'
    id = models.BigAutoField(primary_key=True)
    class_name = models.CharField(null=True, blank=True, max_length=255, db_column='className')
    class_description = models.TextField(null=True, blank=True, db_column='classDescription')
    UI_tool = models.CharField(null=True, blank=True, max_length=255, db_column='UItool')
    conflict_definition = models.CharField(null=True, blank=True, max_length=255, db_column='conflictDefinition')
    is_conflict_arg = models.BooleanField(null=True, blank=True, db_column='isConflictArg')
    is_argument = models.BooleanField(null=True, blank=True, db_column='isArgument')
    argument_type = models.CharField(null=True, blank=True, max_length=255, db_column='argumentType')
    json_structure = models.CharField(null=True, blank=True, max_length=255, db_column='jsonStructure')
    

class QuestionXML(models.Model):
    class Meta:
        db_table = 'QuestionXMLs'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    description = models.TextField(null=True, blank=True)
    answer_fields = JSONField(null=True, blank=True, db_column='answerFieldsJSON')
    example_frames = JSONField(null=True, blank=True, db_column='exampleFramesJSON')
    t_one_direct_payload = models.TextField(null=True, blank=True, db_column='tOneDirectPayload')
    t_two_direct_payload = models.TextField(null=True, blank=True, db_column='tTwoDirectPayload')
    creation_time = models.DateTimeField(null=True, blank=True, db_column='creationTime')
    question_title = models.CharField(null=True, blank=True, max_length=255, db_column='questionTitle')
    question_description = models.TextField(null=True, blank=True, db_column='questionDescription')
    question_inst_text = models.CharField(null=True, blank=True, max_length=255, db_column='questionInstText')
    label_class = models.ForeignKey(LabelClass, models.PROTECT, db_column="labelClassId")
    label_class_arg = models.CharField(null=True, blank=True, max_length=255, db_column='labelClassArg')
    label_class_conf_arg = models.CharField(null=True, blank=True, max_length=255, db_column='labelClassConfArg')


class OutsourcedInst(models.Model):
    class Meta:
        db_table = 'OutsourcedInst'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    annot_inst = models.ForeignKey(AnnotationInstruction, models.PROTECT, db_column="annotInstId")
    question_XML = models.ForeignKey(QuestionXML, models.PROTECT, db_column="questionXMLid")
    frame_dataset = models.ForeignKey(FrameDataset, models.PROTECT, db_column="frameDatasetId")
    label_name = models.CharField(null=True, blank=True, max_length=255, db_column='labelName')
    label_description = models.TextField(null=True, blank=True, db_column='labelDescription')
    HIT_set_name = models.CharField(null=True, blank=True, max_length=255, db_column='HITsetName')
    HIT_set_description = models.TextField(null=True, blank=True, db_column='HITsetDescription')
    t_one_metadata = JSONField(null=True, blank=True, db_column='tOneMetadataJSON')
    t_two_metadata = JSONField(null=True, blank=True, db_column='tTwoMetadataJSON')


class LabelDataset(models.Model):
    class Meta:
        db_table = 'LabelDatasets'
    id = models.BigAutoField(primary_key=True)
    parent_frame_dataset = models.ForeignKey(FrameDataset, models.PROTECT, db_column="parentFrameDatasetId")
    label_name = models.CharField(null=True, blank=True, max_length=255, db_column='labelName')
    label_description = models.TextField(null=True, blank=True, db_column='labelDescription')
    parent_algorithm_model = models.ForeignKey(AlgorithmModel, models.PROTECT, db_column="parentAlgorithmModelId")
    label_class = models.ForeignKey(LabelClass, models.PROTECT, db_column="labelClassId")
    training_instructions = models.ManyToManyField('TrainingInstruction', through='TrainingInstructionsLabelDataset')


class TrainingInstructionsLabelDataset(models.Model):
    class Meta:
        db_table = 'TrainingInstructionsLabelDatasets'
    training_inst = models.ForeignKey(TrainingInstruction, models.PROTECT, db_column='TrainingInstId')
    label_dataset = models.ForeignKey(LabelDataset, models.PROTECT, db_column='labelDatasetId')


class HITset(models.Model):
    class Meta:
        db_table = 'HITsets'
    id = models.BigAutoField(primary_key=True)
    dataset = models.ForeignKey(FrameDataset, models.PROTECT, db_column="frameDatasetId")
    assoc_labelset = models.ForeignKey(LabelDataset, models.PROTECT, db_column="assocLabelsetId")
    t_one_worker_blacklist = JSONField(null=True, blank=True, db_column='tOneWorkerBlacklistJSON')
    name = models.CharField(null=True, blank=True, max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(null=True, blank=True, max_length=255)
    label_name = models.CharField(null=True, blank=True, max_length=255, db_column='labelName')
    label_description = models.TextField(null=True, blank=True, db_column='labelDescription')
    label_class = models.IntegerField(null=True, blank=True, db_column='labelClass')
    dataset_name = models.CharField(null=True, blank=True, max_length=255, db_column='datasetName')
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    time_remaining = models.TimeField(null=True, blank=True, db_column='timeRemaining')
    HIT_percentage = models.IntegerField(null=True, blank=True, db_column='HITpercentage')
    succeeded = models.BooleanField(null=True, blank=True)
    t_one_total_duration = models.IntegerField(null=True, blank=True, db_column='tOneTotalDuration')
    t_one_total_cost = models.CharField(null=True, blank=True, max_length=255, db_column='tOneTotalCost')
    t_two_total_duration = models.IntegerField(null=True, blank=True, db_column='tTwoTotalDuration')
    t_two_total_cost = models.CharField(null=True, blank=True, max_length=255, db_column='tTwoTotalCost')
    total_duration = models.IntegerField(null=True, blank=True, db_column='totalDuration')
    total_cost = models.CharField(null=True, blank=True, max_length=255, db_column='totalCost')
    question_XML = models.ForeignKey(QuestionXML, models.PROTECT, db_column="questionXMLid")
    t_one_metadata = JSONField(null=True, blank=True, db_column='tOneMetadataJSON')
    t_two_metadata = JSONField(null=True, blank=True, db_column='tTwoMetadataJSON')


class Worker(models.Model):
    class Meta:
        db_table = 'Workers'
    id = models.BigAutoField(primary_key=True)
    associated_HIT_sets = JSONField(null=True, blank=True, db_column='associatedHITsetsJSON')
    t_one_assignments_done = models.IntegerField(null=True, blank=True, db_column='tOneAssignmentsDone')
    t_one_rating = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='tOneRating')
    t_two_assignments_done = models.IntegerField(null=True, blank=True, db_column='tTwoAssignmentsDone')
    t_two_rating = models.IntegerField(null=True, blank=True, db_column='tTwoRating')


class OperationClass(models.Model):
    class Meta:
        db_table = 'OperationClasses'
    id = models.BigAutoField(primary_key=True)
    class_name = models.CharField(null=True, blank=True, max_length=255, db_column='className')
    arg_names = JSONField(null=True, blank=True, db_column='argNamesJSON')
    arg_types = JSONField(null=True, blank=True, db_column='argTypesJSON')
    frame_payload = models.TextField(null=True, blank=True, db_column='framePayload')
    label_payload = models.TextField(null=True, blank=True, db_column='labelPayload')
    label_classes = models.ManyToManyField(LabelClass, through='OperationClassesSupportedLabelClass')


class OperationClassesSupportedLabelClass(models.Model):
    class Meta:
        db_table = 'OperationClassesSupportedLabelClasses'
    operation_class = models.ForeignKey(OperationClass, models.PROTECT, db_column='operationClassId')
    label_class = models.ForeignKey(LabelClass, models.PROTECT, db_column='labelClassId')


class OperationInstance(models.Model):
    class Meta:
        db_table = 'OperationInstances'
    id = models.BigAutoField(primary_key=True)
    frame_dataset = models.ForeignKey(FrameDataset, models.PROTECT, db_column="frameDatasetId")
    operation_class = models.ForeignKey(OperationClass, models.PROTECT, db_column="operationClassId")
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')
    ignore_OoB = models.BooleanField(null=True, blank=True, db_column='ignoreOoB')
    fill_type = models.CharField(null=True, blank=True, max_length=255, db_column='fillType')


class QualityMetricStruct(models.Model):
    class Meta:
        db_table = 'QualityMetricStruct'
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    payload = models.TextField(null=True, blank=True)
    type = models.CharField(null=True, blank=True, max_length=255)


class RelevantData(models.Model):
    class Meta:
        db_table = 'RelevantData'
    id = models.BigAutoField(primary_key=True)
    device_instance = models.ForeignKey(DeviceInstance, models.PROTECT, db_column="deviceInstanceId")
    project = models.ForeignKey(Project, models.PROTECT, db_column="projectId")
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column="edgeNodeId")
    feature_model = models.ForeignKey(FeatureModel, models.PROTECT, db_column="featureModelId")
    sensor_GPS_lat = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='sensorGpsLat')
    sensor_GPS_long = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='sensorGpsLong')
    rel_data_type = models.CharField(null=True, blank=True, max_length=255, db_column='relDataType')
    value = models.IntegerField(null=True, blank=True)
    object_model = models.ForeignKey(ObjectModel, models.PROTECT, db_column="objectModelId")
    location_x = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='locationX')
    location_y = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='locationY')
    location_z = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='locationZ')
    orient_theta = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='orientTheta')
    orient_phi = models.DecimalField(null=True, blank=True, max_digits=16, decimal_places=2, db_column='orientPhi')
    timestamp = models.DateTimeField(null=True, blank=True)
    is_tagged_data = models.BooleanField(null=True, blank=True, db_column='isTaggedData')
    tagged_data = models.ForeignKey(FrameDataset, models.PROTECT, db_column="taggedDataId")
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')


class Frame(models.Model):
    class Meta:
        db_table = 'Frames'
    id = models.BigAutoField(primary_key=True)
    frame_file = models.CharField(null=True, blank=True, max_length=255, db_column='frameFile')
    timestamp = models.DateTimeField(null=True, blank=True)
    frame_dataset = models.ForeignKey(FrameDataset, models.PROTECT, db_column="frameDatasetId")
    is_validation = models.BooleanField(null=True, blank=True, db_column='isValidation')


class LabelData(models.Model):
    class Meta:
        db_table = 'LabelData'
    id = models.BigAutoField(primary_key=True)
    data_proper = models.IntegerField(null=True, blank=True, db_column='dataProper')
    label_dataset = models.ForeignKey(LabelDataset, models.PROTECT, db_column="labelDatasetId")
    is_void = models.BooleanField(null=True, blank=True, db_column='isVoid')
    parent_frame = models.ForeignKey(Frame, models.PROTECT, db_column="parentFrame")
    t_one_HIT_id = models.CharField(null=True, blank=True, max_length=255, db_column='tOneHITid')
    t_two_HIT_id = models.CharField(null=True, blank=True, max_length=255, db_column='tTwoHITid')


class TypeCode(models.Model):
    class Meta:
        db_table = 'TypeCode'
    id = models.BigAutoField(primary_key=True)
    type_name = models.CharField(null=True, blank=True, max_length=255, db_column='typeName')
    order = models.IntegerField(null=True, blank=True)
    value = models.CharField(null=True, blank=True, max_length=3)
    short_description = models.TextField(null=True, blank=True, db_column='shortDescription')
    long_description = models.TextField(null=True, blank=True, db_column='longDescription')
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    created_by = models.CharField(null=True, blank=True, max_length=255)


class FileStorage(models.Model):
    class Meta:
        db_table = 'FileStorage'
    id = models.BigAutoField(primary_key=True)
    file_type = models.CharField(null=True, blank=True, max_length=3, db_column='fileType')
    link = models.CharField(null=True, blank=True, max_length=255)


class DetectedObjects(models.Model):
    class Meta:
        db_table = 'DetectedObjects'
    id = models.BigAutoField(primary_key=True)
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column="edgeNodeId")
    object_type = models.CharField(null=True, blank=True, max_length=3, db_column='objectType')
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    file = models.ForeignKey(FileStorage, models.PROTECT, db_column='fileId')
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')


class EventsHistory(models.Model):
    class Meta:
        db_table = 'EventsHistory'
    id = models.BigAutoField(primary_key=True)
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column="edgeNodeId")
    event_type = models.CharField(null=True, blank=True, max_length=3, db_column='eventType')
    verification_result = models.CharField(null=True, blank=True, max_length=3, db_column='verificationResult')
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')


class DetectionsSummary(models.Model):
    class Meta:
        db_table = 'DetectionsSummary'
    id = models.BigAutoField(primary_key=True)
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column="edgeNodeId")
    observation_date = models.DateField(null=True, blank=True, db_column='observationDate')
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')


class RoadConditions(models.Model):
    class Meta:
        db_table = 'RoadConditions'
    id = models.BigAutoField(primary_key=True)
    edge_node = models.ForeignKey(EdgeNode, models.PROTECT, db_column="edgeNodeId")
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')
