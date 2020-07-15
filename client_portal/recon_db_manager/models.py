"""
Recon db mangaer are defined here
"""

from django.contrib.postgres.fields import JSONField
from django.db import models


class Organization(models.Model):
    """
    Organization model
    """
    ROOT = 'Recon AI'

    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    vat = models.CharField(null=True, blank=True, max_length=255,
                           db_column='VAT')
    main_firstname = models.CharField(null=True, blank=True, max_length=255)
    main_lastname = models.CharField(null=True, blank=True, max_length=255)
    main_address = models.CharField(null=True, blank=True, max_length=255)
    main_phone = models.CharField(null=True, blank=True, max_length=255)
    main_email = models.EmailField(null=True, blank=True, max_length=255)
    inv_firstname = models.CharField(null=True, blank=True, max_length=255)
    inv_lastname = models.CharField(null=True, blank=True, max_length=255)
    inv_address = models.CharField(null=True, blank=True, max_length=255)
    inv_phone = models.CharField(null=True, blank=True, max_length=255)
    inv_email = models.EmailField(null=True, blank=True, max_length=255)

    class Meta:
        """
        Organization model's Meta class specification
        """
        db_table = 'Organizations'

    @classmethod
    def root(cls: 'Organization') -> 'Organization':
        """
        :rtype: Organization
        """
        return cls.objects.get(name=cls.ROOT)


class CommonUser(models.Model):
    """
    CommonUser model
    """
    id = models.BigAutoField(primary_key=True)
    organization = models.ForeignKey(Organization, models.DO_NOTHING,
                                     db_column='organizationId')
    firstname = models.CharField(null=True, max_length=255)
    lastname = models.CharField(null=True, max_length=255)
    address = models.CharField(null=True, max_length=255)
    phone = models.CharField(null=True, max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    created_dt = models.DateTimeField(null=True, auto_now_add=True)
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(null=True, blank=True, max_length=255)
    user_level = models.CharField(null=True, blank=True, max_length=3)
    is_active = models.BooleanField(null=False, default=False,
                                    db_column='isEmailVerified')

    class Meta:
        """
        CommonUser model's Meta class specification
        """
        abstract = True


class User(CommonUser):
    """
    User model
    """

    class Meta:
        """
        User model's Meta class specification
        """
        db_table = 'Users'


class License(models.Model):
    """
    License model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    type = models.CharField(null=False, blank=False, max_length=3,
                            db_column='license_type')
    price = models.CharField(null=True, blank=True, max_length=255)
    user = models.ForeignKey(User, models.DO_NOTHING, db_column="userId")
    next_payment = models.DateTimeField(null=True, blank=True,
                                        db_column='nextPayment')
    purchase_date = models.DateTimeField(null=True, blank=True,
                                         db_column='purchaseDate')
    termination_date = models.DateTimeField(null=True, blank=True,
                                            db_column='terminationDate')

    class Meta:
        """
        License model's Meta class specification
        """
        db_table = 'Licenses'


class Ecosystem(models.Model):
    """
    Ecosystem model
    """
    id = models.BigAutoField(primary_key=True)
    organization = models.ForeignKey(Organization, models.DO_NOTHING,
                                     db_column="organizationId")

    class Meta:
        """
        Ecosystem model's Meta class specification
        """
        db_table = 'Ecosystems'


class FeatureModel(models.Model):
    """
    FeatureModel model
    """
    id = models.BigAutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    alg_class_sequence = JSONField(null=True, blank=True,
                                   db_column='algClassSequenceJSON')
    input_device_class_reqs = JSONField(null=True, blank=True,
                                        db_column='inputDeviceClassReqsJSON')
    input_device_param_reqs = JSONField(null=True, blank=True,
                                        db_column='inputDeviceParamReqsJSON')
    high_level_reqs = JSONField(null=True, blank=True,
                                db_column='highLevelReqsJSON')
    version = models.IntegerField(null=True, blank=True)

    class Meta:
        """
        FeatureModel model's Meta class specification
        """
        db_table = 'FeatureModels'


class Project(models.Model):
    """
    Project model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    decription = models.CharField(null=True, blank=True, max_length=255)
    organization = models.ForeignKey(Organization, models.DO_NOTHING,
                                     null=True, blank=True,
                                     db_column="organizationId")
    ecosystem = models.ForeignKey(Ecosystem, models.DO_NOTHING, null=True,
                                  blank=True, db_column="ecosystemId")
    featuremodel = models.ForeignKey(FeatureModel, models.DO_NOTHING,
                                     null=True, blank=True,
                                     db_column="featuremodelId")
    status = models.CharField(null=True, blank=True, max_length=255)
    settings = JSONField(null=True, blank=True, db_column='settingsJSON')

    class Meta:
        """
        Project model's Meta class specification
        """
        db_table = 'Projects'


class DockerModel(models.Model):
    """
    DockerModel model
    """
    id = models.BigAutoField(primary_key=True)
    docker_payload = models.TextField(null=True, blank=True,
                                      db_column='dockerPayload')
    version = models.IntegerField(null=True, blank=True)
    feature_models = models.ManyToManyField(FeatureModel,
                                            through='DockerModelFeatureModel')

    class Meta:
        """
        DockerModel model's Meta class specification
        """
        db_table = 'DockerModels'


class DockerModelFeatureModel(models.Model):
    """
    DockerModelFeatureModel model
    """
    docker_model = models.ForeignKey(DockerModel, models.DO_NOTHING,
                                     db_column='dockerModelId')
    feature_model = models.ForeignKey(FeatureModel, models.DO_NOTHING,
                                      db_column='featureModelId')

    class Meta:
        """
        DockerModelFeatureModel model's Meta class specification
        """
        db_table = 'DockerModelFeatureModel'


class DockerInstance(models.Model):
    """
    DockerInstance model
    """
    id = models.BigAutoField(primary_key=True)
    docker_model = models.ForeignKey(DockerModel, models.DO_NOTHING,
                                     db_column="dockerModelId")
    version = models.IntegerField(null=True, blank=True)

    class Meta:
        """
        DockerInstance model's Meta class specification
        """
        db_table = 'DockerInstances'


class EdgeNode(models.Model):
    """
    EdgeNode model
    """
    id = models.BigAutoField(primary_key=True)
    organization = models.ForeignKey(Organization, models.DO_NOTHING,
                                     db_column="organizationId")
    feature_models = JSONField(null=True, blank=True,
                               db_column='featureModelsJSON')
    feature_instances = JSONField(null=True, blank=True,
                                  db_column='featureInstancesJSON')
    docker_instance = models.ForeignKey(DockerInstance, models.DO_NOTHING,
                                        db_column="dockerInstanceId")
    projects = models.ManyToManyField(Project, through='ProjectEdgeNode')
    ecosystems = models.ManyToManyField(Ecosystem,
                                        through='EcosystemsEdgeNode')

    class Meta:
        """
        EdgeNode model's Meta class specification
        """
        db_table = 'EdgeNodes'


class EcosystemsEdgeNode(models.Model):
    """
    EcosystemsEdgeNode model
    """
    ecosystem = models.ForeignKey(Ecosystem, models.DO_NOTHING,
                                  db_column='ecosystemId')
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column='edgeNodeId')

    class Meta:
        """
        EcosystemsEdgeNode model's Meta class specification
        """
        db_table = 'EcosystemsEdgeNodes'


class ProjectEdgeNode(models.Model):
    """
    ProjectEdgeNode model
    """
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column='projectId')
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column='edgeNodeId')

    class Meta:
        """
        ProjectEdgeNode model's Meta class specification
        """
        db_table = 'ProjectEdgeNodes'


class DeviceParameter(models.Model):
    """
    DeviceParameter model
    """
    id = models.BigAutoField(primary_key=True)
    is_sensor = models.BooleanField(null=True, blank=True,
                                    db_column='isSensor')
    is_ECU = models.BooleanField(null=True, blank=True, db_column='isECU')
    is_camera = models.BooleanField(null=True, blank=True,
                                    db_column='isCamera')
    is_lidar = models.BooleanField(null=True, blank=True, db_column='isLidar')
    is_illu = models.BooleanField(null=True, blank=True, db_column='isIllu')
    is_thermal = models.BooleanField(null=True, blank=True,
                                     db_column='isThermal')
    is_radar = models.BooleanField(null=True, blank=True, db_column='isRadar')
    model_number = models.IntegerField(null=True, blank=True,
                                       db_column='modelNumber')
    manufacturer = models.CharField(null=True, blank=True, max_length=255)
    name = models.CharField(null=True, blank=True, max_length=255)
    email = models.CharField(null=True, blank=True, max_length=255)
    phone = models.IntegerField(null=True, blank=True)
    price = models.IntegerField(null=True, blank=True)
    DDP_fin = models.IntegerField(null=True, blank=True, db_column='DDPfin')
    IP_code = models.CharField(null=True, blank=True, max_length=255,
                               db_column='IPcode')
    power_consumption = models.IntegerField(null=True, blank=True,
                                            db_column='powerConsumption')
    device_size_x = models.IntegerField(null=True, blank=True,
                                        db_column='deviceSizeX')
    device_size_y = models.IntegerField(null=True, blank=True,
                                        db_column='deviceSizeY')
    device_size_z = models.IntegerField(null=True, blank=True,
                                        db_column='deviceSizeZ')
    integrated_measures = JSONField(null=True, blank=True,
                                    db_column='integratedMeasuresJSON')
    camera_data = JSONField(null=True, blank=True, db_column='cameraDataJSON')
    ECU_data = JSONField(null=True, blank=True, db_column='ECUDataJSON')
    lidar_data = JSONField(null=True, blank=True, db_column='lidarDataJSON')
    illum_data = JSONField(null=True, blank=True, db_column='illumDataJSON')
    thermal_data = JSONField(null=True, blank=True,
                             db_column='thermalDataJSON')
    radar_data = JSONField(null=True, blank=True, db_column='radarDataJSON')
    power_data = JSONField(null=True, blank=True, db_column='powerDataJSON')
    other_data = JSONField(null=True, blank=True, db_column='otherDataJSON')

    class Meta:
        """
        DeviceParameter model's Meta class specification
        """
        db_table = 'DeviceParameters'


class DeviceClass(models.Model):
    """
    DeviceClass model
    """
    id = models.BigAutoField(primary_key=True)
    docker_base = models.CharField(null=True, blank=True, max_length=255,
                                   db_column='dockerBase')
    device_parameter = models.ForeignKey(DeviceParameter, models.DO_NOTHING,
                                         db_column="deviceParameterId")
    docker_models = models.ManyToManyField(DockerModel,
                                           through='DockerModelDeviceClass')

    class Meta:
        """
        DeviceClass model's Meta class specification
        """
        db_table = 'DeviceClasses'


class DockerModelDeviceClass(models.Model):
    """
    DockerModelDeviceClass model
    """
    docker_model = models.ForeignKey(DockerModel, models.DO_NOTHING,
                                     db_column='dockerModelId')
    device_class = models.ForeignKey(DeviceClass, models.DO_NOTHING,
                                     db_column='deviceClassId')
    type = models.CharField(null=True, blank=True, max_length=3)

    class Meta:
        """
        DockerModelDeviceClass model's Meta class specification
        """
        db_table = 'DockerModelDeviceClasses'


class DeviceInstance(models.Model):
    """
    DeviceInstance model
    """
    id = models.BigAutoField(primary_key=True)
    device_class = models.ForeignKey(DeviceClass, models.DO_NOTHING, null=True,
                                     blank=True, db_column="deviceClassId")
    serial = models.IntegerField(null=True, blank=True)
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')
    edge_nodes = models.ManyToManyField(EdgeNode, through='EdgeNodeDevice')

    class Meta:
        """
        DeviceInstance model's Meta class specification
        """
        db_table = 'DeviceInstances'


class EdgeNodeDevice(models.Model):
    """
    EdgeNodeDevice model
    """
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column='edgeNodeId')
    device_instance = models.ForeignKey(DeviceInstance, models.DO_NOTHING,
                                        db_column='deviceInstanceId')
    type = models.CharField(null=True, blank=True, max_length=3)

    class Meta:
        """
        EdgeNodeDevice model's Meta class specification
        """
        db_table = 'EdgeNodeDevices'


class FeatureInstance(models.Model):
    """
    FeatureInstance model
    """
    id = models.BigAutoField(primary_key=True)
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column="projectId")
    feature_model = models.ForeignKey(FeatureModel, models.DO_NOTHING,
                                      db_column="featureModelId")
    high_level_fidelity = JSONField(null=True, blank=True,
                                    db_column='highLevelFidelityJSON')
    total_comp_time = models.IntegerField(null=True, blank=True,
                                          db_column='totalCompTime')
    parent_ECU_class = models.ForeignKey(DeviceClass, models.DO_NOTHING,
                                         db_column="parentECUclass")
    version = models.IntegerField(null=True, blank=True)

    class Meta:
        """
        FeatureInstance model's Meta class specification
        """
        db_table = 'FeatureInstances'


class Architecture(models.Model):
    """
    Architecture model
    """
    id = models.BigAutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    payload = models.TextField(null=True, blank=True)
    version = models.IntegerField(null=True, blank=True)

    class Meta:
        """
        Architecture model's Meta class specification
        """
        db_table = 'Architectures'


class Weight(models.Model):
    """
    Weight model
    """
    id = models.BigAutoField(primary_key=True)
    payload = models.TextField(null=True, blank=True)
    version = models.IntegerField(null=True, blank=True)

    class Meta:
        """
        Weight model's Meta class specification
        """
        db_table = 'Weights'


class AlgorithmModel(models.Model):
    """
    AlgorithmModel model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    description = models.TextField(null=True, blank=True)
    preprocessor = models.CharField(null=True, blank=True, max_length=255)
    architecture = models.ForeignKey(Architecture, models.DO_NOTHING,
                                     db_column="architectureId")
    postprocessor = models.CharField(null=True, blank=True, max_length=255)
    payload = models.TextField(null=True, blank=True)
    hyperparameter_structure = \
        JSONField(null=True, blank=True,
                  db_column='HyperparameterStructureJSON')
    validation_structure = JSONField(null=True, blank=True,
                                     db_column='ValidationStructureJSON')
    model_class = models.CharField(null=True, blank=True, db_column='class',
                                   max_length=3)
    is_trainable = models.BooleanField(null=True, blank=True,
                                       db_column='isTrainable')
    init_weight = models.ForeignKey(Weight, models.DO_NOTHING, null=True,
                                    blank=True, db_column="initWeights")
    version = models.IntegerField(null=True, blank=True)
    feature_models = models.ManyToManyField(FeatureModel,
                                            through='FeatureModelAlgorithm')

    class Meta:
        """
        AlgorithmModel model's Meta class specification
        """
        db_table = 'AlgorithmModels'


class FeatureModelAlgorithm(models.Model):
    """
    FeatureModelAlgorithm model
    """
    feature_model = models.ForeignKey(FeatureModel, models.DO_NOTHING,
                                      db_column='featureModelId')
    algorithm_model = models.ForeignKey(AlgorithmModel, models.DO_NOTHING,
                                        db_column='algorithmModelId')

    class Meta:
        """
        FeatureModelAlgorithm model's Meta class specification
        """
        db_table = 'FeatureModelAlgorithm'


class ValidationInstruction(models.Model):
    """
    ValidationInstruction model
    """
    id = models.BigAutoField(primary_key=True)
    metadata = JSONField(null=True, blank=True, db_column='metadataJSON')

    class Meta:
        """
        ValidationInstruction model's Meta class specification
        """
        db_table = 'ValidationInstructions'


class DataSplitInstruction(models.Model):
    """
    DataSplitInstruction model
    """
    id = models.BigAutoField(primary_key=True)
    metadata = JSONField(null=True, blank=True, db_column='metadataJSON')

    class Meta:
        """
        DataSplitInstruction model's Meta class specification
        """
        db_table = 'DataSplitInstructions'


class TrainingInstruction(models.Model):
    """
    TrainingInstruction model
    """
    id = models.BigAutoField(primary_key=True)
    data_split_inst = models.ForeignKey(DataSplitInstruction,
                                        models.DO_NOTHING,
                                        db_column="dataSplitInst")
    hyperparameters = JSONField(null=True, blank=True,
                                db_column='hyperparametersJSON')

    class Meta:
        """
        TrainingInstruction model's Meta class specification
        """
        db_table = 'TrainingInstructions'


class AlgorithmInstance(models.Model):
    """
    AlgorithmInstance model
    """
    id = models.BigAutoField(primary_key=True)
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column="projectId")
    algorithm_model = models.ForeignKey(AlgorithmModel, models.DO_NOTHING,
                                        db_column="algorithmModelId")
    weight = models.ForeignKey(Weight, models.DO_NOTHING, db_column="weightId")
    version = models.IntegerField(null=True, blank=True)
    status = models.CharField(null=True, blank=True, max_length=3)
    current_validation = JSONField(null=True, blank=True,
                                   db_column='currentValidationJSON')
    progress_percentage = models.IntegerField(null=True, blank=True,
                                              db_column='progressPercentage')
    validation_history = JSONField(null=True, blank=True,
                                   db_column='validationHistoryJSON')
    creation_date = models.DateTimeField(null=True, blank=True,
                                         auto_now_add=True,
                                         db_column='creationDate')
    training_log = models.CharField(null=True, blank=True, max_length=255,
                                    db_column='trainingLog')
    device_instances = models.\
        ManyToManyField(DeviceInstance,
                        through='AlgorithmInstanceDeployedDevice')
    feature_instances = models.\
        ManyToManyField(FeatureInstance,
                        through='FeatureInstanceAlgorithm')
    training_instructions = models.\
        ManyToManyField(TrainingInstruction,
                        through='AlgorithmInstanceTrainingInst')

    class Meta:
        """
        AlgorithmInstance model's Meta class specification
        """
        db_table = 'AlgorithmInstances'


class AlgorithmInstanceTrainingInst(models.Model):
    """
    AlgorithmInstanceTrainingInst model
    """
    algorithm_instance = models.ForeignKey(AlgorithmInstance,
                                           models.DO_NOTHING,
                                           db_column='algorithmInstanceId')
    training_instruction = models.ForeignKey(TrainingInstruction,
                                             models.DO_NOTHING,
                                             db_column='trainingInstructionId')

    class Meta:
        """
        AlgorithmInstanceTrainingInst model's Meta class specification
        """
        db_table = 'AlgorithmInstanceTrainingInst'


class FeatureInstanceAlgorithm(models.Model):
    """
    FeatureInstanceAlgorithm model
    """
    feature_instance = models.ForeignKey(FeatureInstance, models.DO_NOTHING,
                                         db_column='featureInstanceId')
    algorithm = models.ForeignKey(AlgorithmInstance, models.DO_NOTHING,
                                  db_column='algorithmId')

    class Meta:
        """
        FeatureInstanceAlgorithm model's Meta class specification
        """
        db_table = 'FeatureInstanceAlgorithm'


class AlgorithmInstanceDeployedDevice(models.Model):
    """
    AlgorithmInstanceDeployedDevice model
    """
    algorithm_instance = models.ForeignKey(AlgorithmInstance,
                                           models.DO_NOTHING,
                                           db_column='algorithmInstanceId')
    deployed_device_instance = models.\
        ForeignKey(DeviceInstance,
                   models.DO_NOTHING, db_column='deployedDeviceInstanceId')

    class Meta:
        """
        AlgorithmInstanceDeployedDevice model's Meta class specification
        """
        db_table = 'AlgorithmInstanceDeployedDevices'


class ObjectModel(models.Model):
    """
    ObjectModel model
    """
    id = models.BigAutoField(primary_key=True)
    description = models.TextField(null=True, blank=True)
    object_file = models.CharField(null=True, blank=True, max_length=255,
                                   db_column='objectFile')
    version = models.IntegerField(null=True, blank=True)
    algorithm_instances = models.\
        ManyToManyField(AlgorithmInstance,
                        through='AlgorithmInstanceObjectModel')
    projects = models.\
        ManyToManyField(Project, through='ObjectModelProject')
    feature_models = models.\
        ManyToManyField(FeatureModel, through='ObjectModelFeatureModel')
    algorithm_models = models.\
        ManyToManyField(AlgorithmModel, through='ObjectModelAlgorithmModel')

    class Meta:
        """
        ObjectModel model's Meta class specification
        """
        db_table = 'ObjectModels'


class ObjectModelAlgorithmModel(models.Model):
    """
    ObjectModelAlgorithmModel model
    """
    object_model = models.ForeignKey(ObjectModel, models.DO_NOTHING,
                                     db_column='objectModelId')
    algorithm_model = models.ForeignKey(AlgorithmModel, models.DO_NOTHING,
                                        db_column='algorithmModelId')

    class Meta:
        """
        ObjectModelAlgorithmModel model's Meta class specification
        """
        db_table = 'ObjectModelAlgorithmModel'


class ObjectModelFeatureModel(models.Model):
    """
    ObjectModelFeatureModel model
    """
    object_model = models.ForeignKey(ObjectModel, models.DO_NOTHING,
                                     db_column='objectModelId')
    feature_model = models.ForeignKey(FeatureModel, models.DO_NOTHING,
                                      db_column='featureModelId')

    class Meta:
        """
        ObjectModelFeatureModel model's Meta class specification
        """
        db_table = 'ObjectModelFeatureModel'


class ObjectModelProject(models.Model):
    """
    ObjectModelProject model
    """
    object_model = models.ForeignKey(ObjectModel, models.DO_NOTHING,
                                     db_column='objectModelId')
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column='projectId')

    class Meta:
        """
        ObjectModelProject model's Meta class specification
        """
        db_table = 'ObjectModelProject'


class AlgorithmInstanceObjectModel(models.Model):
    """
    AlgorithmInstanceObjectModel model
    """
    algorithm_instance = models.ForeignKey(AlgorithmInstance,
                                           models.DO_NOTHING,
                                           db_column='algorithmInstanceId')
    object_model = models.ForeignKey(ObjectModel, models.DO_NOTHING,
                                     db_column='objectModelId')

    class Meta:
        """
        AlgorithmInstanceObjectModel model's Meta class specification
        """
        db_table = 'AlgorithmInstanceObjectModel'


class DataAcqInstruction(models.Model):
    """
    DataAcqInstruction model
    """
    id = models.BigAutoField(primary_key=True)
    video_download = models.BooleanField(null=True, blank=True,
                                         db_column='videoDownload')
    video_download_params = JSONField(null=True, blank=True,
                                      db_column='videoDownloadParamsJSON')
    real_data_params = JSONField(null=True, blank=True,
                                 db_column='realDataParamsJSON')
    SDG_one = models.BooleanField(null=True, blank=True, db_column='SDGone')
    SDG_one_params = JSONField(null=True, blank=True,
                               db_column='SDGoneParamsJSON')

    class Meta:
        """
        DataAcqInstruction model's Meta class specification
        """
        db_table = 'DataAcqInstructions'


class AnnotationInstruction(models.Model):
    """
    AnnotationInstruction model
    """
    id = models.BigAutoField(primary_key=True)
    outsourced_meta = JSONField(null=True, blank=True,
                                db_column='outsourcedMetaJSON')
    SDG_two = models.BooleanField(null=True, blank=True, db_column='SDGtwo')
    SDG_two_inst = JSONField(null=True, blank=True, db_column='SDGtwoInstJSON')

    class Meta:
        """
        AnnotationInstruction model's Meta class specification
        """
        db_table = 'AnnotationInstructions'


class FrameDataset(models.Model):
    """
    FrameDataset model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    is_continuous = models.BooleanField(null=True, blank=True,
                                        db_column='isContinuous')
    time_start = models.IntegerField(null=True, blank=True,
                                     db_column='timeStart')
    time_end = models.IntegerField(null=True, blank=True, db_column='timeEnd')
    is_labeled = models.BooleanField(null=True, blank=True,
                                     db_column='isLabeled')
    VDL_is_downloaded = models.BooleanField(null=True, blank=True,
                                            db_column='VDLisDownloaded')
    VDL_address = models.CharField(null=True, blank=True, max_length=255,
                                   db_column='VDLaddress')
    VDL_timestamp_found = models.DateTimeField(null=True, blank=True,
                                               db_column='VDLtimestampFound')
    data_acq_instruction = models.ForeignKey(DataAcqInstruction,
                                             models.DO_NOTHING,
                                             db_column='DataAcqInstructionsId')
    aug_metadata = JSONField(null=True, blank=True,
                             db_column='augMetadataJSON')
    projects = models.ManyToManyField(Project, through='FrameDatasetsProject')

    class Meta:
        """
        FrameDataset model's Meta class specification
        """
        db_table = 'FrameDatasets'


class FrameDatasetsProject(models.Model):
    """
    FrameDatasetsProject model
    """
    frame_dataset = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                      db_column='frameDatasetId')
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column='projectId')

    class Meta:
        """
        FrameDatasetsProject model's Meta class specification
        """
        db_table = 'FrameDatasetsProjects'


class AugmentationInstruction(models.Model):
    """
    AugmentationInstruction model
    """
    id = models.BigAutoField(primary_key=True)
    frame_dataset = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                      db_column="frameDatasetId")
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column="projectId")
    aug_operations = JSONField(null=True, blank=True,
                               db_column='augOperationsJSON')

    class Meta:
        """
        AugmentationInstruction model's Meta class specification
        """
        db_table = 'AugmentationInstructions'


class ProjectInstruction(models.Model):
    """
    ProjectInstruction model
    """
    id = models.BigAutoField(primary_key=True)
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column="projectId")
    data_acq_inst = models.ForeignKey(DataAcqInstruction, models.DO_NOTHING,
                                      db_column="dataAcqInstId")
    annot_inst = models.ForeignKey(AnnotationInstruction, models.DO_NOTHING,
                                   db_column="annotInstId")
    augment_inst = models.ForeignKey(AugmentationInstruction,
                                     models.DO_NOTHING,
                                     db_column="augmentInstId")
    training_inst = models.ForeignKey(TrainingInstruction, models.DO_NOTHING,
                                      db_column="trainingInstrId")
    validation_inst = models.ForeignKey(ValidationInstruction,
                                        models.DO_NOTHING,
                                        db_column="validationInstrId")
    version = models.IntegerField(null=True, blank=True)

    class Meta:
        """
        ProjectInstruction model's Meta class specification
        """
        db_table = 'ProjectInstructions'


class LabelClass(models.Model):
    """
    LabelClass model
    """
    id = models.BigAutoField(primary_key=True)
    class_name = models.CharField(null=True, blank=True, max_length=255,
                                  db_column='className')
    class_description = models.TextField(null=True, blank=True,
                                         db_column='classDescription')
    UI_tool = models.CharField(null=True, blank=True, max_length=255,
                               db_column='UItool')
    conflict_definition = models.CharField(null=True, blank=True,
                                           max_length=255,
                                           db_column='conflictDefinition')
    is_conflict_arg = models.BooleanField(null=True, blank=True,
                                          db_column='isConflictArg')
    is_argument = models.BooleanField(null=True, blank=True,
                                      db_column='isArgument')
    argument_type = models.CharField(null=True, blank=True, max_length=255,
                                     db_column='argumentType')
    json_structure = JSONField(null=True, blank=True, db_column='structure')

    class Meta:
        """
        LabelClass model's Meta class specification
        """
        db_table = 'LabelClasses'


class QuestionXML(models.Model):
    """
    QuestionXML model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    description = models.TextField(null=True, blank=True)
    answer_fields = JSONField(null=True, blank=True,
                              db_column='answerFieldsJSON')
    example_frames = JSONField(null=True, blank=True,
                               db_column='exampleFramesJSON')
    t_one_direct_payload = models.TextField(null=True, blank=True,
                                            db_column='tOneDirectPayload')
    t_two_direct_payload = models.TextField(null=True, blank=True,
                                            db_column='tTwoDirectPayload')
    creation_time = models.DateTimeField(null=True, blank=True,
                                         db_column='creationTime')
    question_title = models.CharField(null=True, blank=True, max_length=255,
                                      db_column='questionTitle')
    question_description = models.TextField(null=True, blank=True,
                                            db_column='questionDescription')
    question_inst_text = models.CharField(null=True, blank=True,
                                          max_length=255,
                                          db_column='questionInstText')
    label_class = models.ForeignKey(LabelClass, models.DO_NOTHING,
                                    db_column="labelClassId")
    label_class_arg = models.CharField(null=True, blank=True, max_length=255,
                                       db_column='labelClassArg')
    label_class_conf_arg = models.CharField(null=True, blank=True,
                                            max_length=255,
                                            db_column='labelClassConfArg')

    class Meta:
        """
        QuestionXML model's Meta class specification
        """
        db_table = 'QuestionXMLs'


class OutsourcedInst(models.Model):
    """
    OutsourcedInst model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    annot_inst = models.ForeignKey(AnnotationInstruction, models.DO_NOTHING,
                                   db_column="annotInstId")
    question_XML = models.ForeignKey(QuestionXML, models.DO_NOTHING,
                                     db_column="questionXMLid")
    frame_dataset = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                      db_column="frameDatasetId")
    label_name = models.CharField(null=True, blank=True, max_length=255,
                                  db_column='labelName')
    label_description = models.TextField(null=True, blank=True,
                                         db_column='labelDescription')
    HIT_set_name = models.CharField(null=True, blank=True, max_length=255,
                                    db_column='HITsetName')
    HIT_set_description = models.TextField(null=True, blank=True,
                                           db_column='HITsetDescription')
    t_one_metadata = JSONField(null=True, blank=True,
                               db_column='tOneMetadataJSON')
    t_two_metadata = JSONField(null=True, blank=True,
                               db_column='tTwoMetadataJSON')

    class Meta:
        """
        OutsourcedInst model's Meta class specification
        """
        db_table = 'OutsourcedInst'


class LabelDataset(models.Model):
    """
    LabelDataset model
    """
    id = models.BigAutoField(primary_key=True)
    parent_frame_dataset = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                             db_column="parentFrameDatasetId")
    label_name = models.CharField(null=True, blank=True, max_length=255,
                                  db_column='labelName')
    label_description = models.TextField(null=True, blank=True,
                                         db_column='labelDescription')
    parent_algorithm_model = models.\
        ForeignKey(AlgorithmModel,
                   models.DO_NOTHING, db_column="parentAlgorithmModelId")
    label_class = models.ForeignKey(LabelClass, models.DO_NOTHING,
                                    db_column="labelClassId")
    training_instructions = models.\
        ManyToManyField('TrainingInstruction',
                        through='TrainingInstructionsLabelDataset')

    class Meta:
        """
        LabelDataset model's Meta class specification
        """
        db_table = 'LabelDatasets'


class TrainingInstructionsLabelDataset(models.Model):
    """
    TrainingInstructionsLabelDataset model
    """
    training_inst = models.ForeignKey(TrainingInstruction, models.DO_NOTHING,
                                      db_column='TrainingInstId')
    label_dataset = models.ForeignKey(LabelDataset, models.DO_NOTHING,
                                      db_column='labelDatasetId')

    class Meta:
        """
        TrainingInstructionsLabelDataset model's Meta class specification
        """
        db_table = 'TrainingInstructionsLabelDatasets'


class HITset(models.Model):
    """
    HITset model
    """
    id = models.BigAutoField(primary_key=True)
    dataset = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                db_column="frameDatasetId")
    assoc_labelset = models.ForeignKey(LabelDataset, models.DO_NOTHING,
                                       db_column="assocLabelsetId")
    t_one_worker_blacklist = JSONField(null=True, blank=True,
                                       db_column='tOneWorkerBlacklistJSON')
    name = models.CharField(null=True, blank=True, max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(null=True, blank=True, max_length=255)
    label_name = models.CharField(null=True, blank=True, max_length=255,
                                  db_column='labelName')
    label_description = models.TextField(null=True, blank=True,
                                         db_column='labelDescription')
    label_class = models.IntegerField(null=True, blank=True,
                                      db_column='labelClass')
    dataset_name = models.CharField(null=True, blank=True, max_length=255,
                                    db_column='datasetName')
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    time_remaining = models.TimeField(null=True, blank=True,
                                      db_column='timeRemaining')
    HIT_percentage = models.IntegerField(null=True, blank=True,
                                         db_column='HITpercentage')
    succeeded = models.BooleanField(null=True, blank=True)
    t_one_total_duration = models.IntegerField(null=True, blank=True,
                                               db_column='tOneTotalDuration')
    t_one_total_cost = models.CharField(null=True, blank=True, max_length=255,
                                        db_column='tOneTotalCost')
    t_two_total_duration = models.IntegerField(null=True, blank=True,
                                               db_column='tTwoTotalDuration')
    t_two_total_cost = models.CharField(null=True, blank=True, max_length=255,
                                        db_column='tTwoTotalCost')
    total_duration = models.IntegerField(null=True, blank=True,
                                         db_column='totalDuration')
    total_cost = models.CharField(null=True, blank=True, max_length=255,
                                  db_column='totalCost')
    question_XML = models.ForeignKey(QuestionXML, models.DO_NOTHING,
                                     db_column="questionXMLid")
    t_one_metadata = JSONField(null=True, blank=True,
                               db_column='tOneMetadataJSON')
    t_two_metadata = JSONField(null=True, blank=True,
                               db_column='tTwoMetadataJSON')

    class Meta:
        """
        HITset model's Meta class specification
        """
        db_table = 'HITsets'


class Worker(models.Model):
    """
    Worker model
    """
    id = models.BigAutoField(primary_key=True)
    associated_HIT_sets = JSONField(null=True, blank=True,
                                    db_column='associatedHITsetsJSON')
    t_one_assignments_done = models.\
        IntegerField(null=True, blank=True, db_column='tOneAssignmentsDone')
    t_one_rating = models.DecimalField(null=True, blank=True, max_digits=16,
                                       decimal_places=2,
                                       db_column='tOneRating')
    t_two_assignments_done = models.\
        IntegerField(null=True, blank=True, db_column='tTwoAssignmentsDone')
    t_two_rating = models.DecimalField(null=True, blank=True, max_digits=16,
                                       decimal_places=2,
                                       db_column='tTwoRating')

    class Meta:
        """
        Worker model's Meta class specification
        """
        db_table = 'Workers'


class OperationClass(models.Model):
    """
    OperationClass model
    """
    id = models.BigAutoField(primary_key=True)
    class_name = models.CharField(null=True, blank=True, max_length=255,
                                  db_column='className')
    arg_names = JSONField(null=True, blank=True, db_column='argNamesJSON')
    arg_types = JSONField(null=True, blank=True, db_column='argTypesJSON')
    frame_payload = models.TextField(null=True, blank=True,
                                     db_column='framePayload')
    label_payload = models.TextField(null=True, blank=True,
                                     db_column='labelPayload')
    label_classes = models.\
        ManyToManyField(LabelClass,
                        through='OperationClassesSupportedLabelClass')

    class Meta:
        """
        OperationClass model's Meta class specification
        """
        db_table = 'OperationClasses'


class OperationClassesSupportedLabelClass(models.Model):
    """
    OperationClassesSupportedLabelClass model
    """
    operation_class = models.ForeignKey(OperationClass, models.DO_NOTHING,
                                        db_column='operationClassId')
    label_class = models.ForeignKey(LabelClass, models.DO_NOTHING,
                                    db_column='labelClassId')

    class Meta:
        """
        OperationClassesSupportedLabelClass model's Meta class specification
        """
        db_table = 'OperationClassesSupportedLabelClasses'


class OperationInstance(models.Model):
    """
    OperationInstance model
    """
    id = models.BigAutoField(primary_key=True)
    frame_dataset = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                      db_column="frameDatasetId")
    operation_class = models.ForeignKey(OperationClass, models.DO_NOTHING,
                                        db_column="operationClassId")
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')
    ignore_OoB = models.BooleanField(null=True, blank=True,
                                     db_column='ignoreOoB')
    fill_type = models.CharField(null=True, blank=True, max_length=255,
                                 db_column='fillType')

    class Meta:
        """
        OperationInstance model's Meta class specification
        """
        db_table = 'OperationInstances'


class QualityMetricStruct(models.Model):
    """
    QualityMetricStruct model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(null=True, blank=True, max_length=255)
    payload = models.TextField(null=True, blank=True)
    type = models.CharField(null=True, blank=True, max_length=255)

    class Meta:
        """
        QualityMetricStruct model's Meta class specification
        """
        db_table = 'QualityMetricStruct'


class RelevantData(models.Model):
    """
    RelevantData model
    """
    id = models.BigAutoField(primary_key=True)
    device_instance = models.ForeignKey(DeviceInstance, models.DO_NOTHING,
                                        db_column="deviceInstanceId")
    project = models.ForeignKey(Project, models.DO_NOTHING,
                                db_column="projectId")
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column="edgeNodeId")
    feature_model = models.ForeignKey(FeatureModel, models.DO_NOTHING,
                                      db_column="featureModelId")
    sensor_GPS_lat = models.DecimalField(null=True, blank=True,
                                         max_digits=16, decimal_places=2,
                                         db_column='sensorGpsLat')
    sensor_GPS_long = models.DecimalField(null=True, blank=True,
                                          max_digits=16, decimal_places=2,
                                          db_column='sensorGpsLong')
    rel_data_type = models.CharField(null=True, blank=True, max_length=255,
                                     db_column='relDataType')
    value = models.IntegerField(null=True, blank=True)
    object_model = models.ForeignKey(ObjectModel, models.DO_NOTHING,
                                     db_column="objectModelId")
    location_x = models.DecimalField(null=True, blank=True, max_digits=16,
                                     decimal_places=2, db_column='locationX')
    location_y = models.DecimalField(null=True, blank=True, max_digits=16,
                                     decimal_places=2, db_column='locationY')
    location_z = models.DecimalField(null=True, blank=True, max_digits=16,
                                     decimal_places=2, db_column='locationZ')
    orient_theta = models.DecimalField(null=True, blank=True, max_digits=16,
                                       decimal_places=2,
                                       db_column='orientTheta')
    orient_phi = models.DecimalField(null=True, blank=True, max_digits=16,
                                     decimal_places=2, db_column='orientPhi')
    timestamp = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    is_tagged_data = models.BooleanField(null=True, blank=True,
                                         db_column='isTaggedData')
    tagged_data = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                    db_column="taggedDataId")
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')

    class Meta:
        """
        RelevantData model's Meta class specification
        """
        db_table = 'RelevantData'


class Frame(models.Model):
    """
    Frame model
    """
    id = models.BigAutoField(primary_key=True)
    frame_file = models.CharField(null=True, blank=True, max_length=255,
                                  db_column='frameFile')
    timestamp = models.DateTimeField(null=True, blank=True)
    frame_dataset = models.ForeignKey(FrameDataset, models.DO_NOTHING,
                                      db_column="frameDatasetId")
    is_validation = models.BooleanField(null=True, blank=True,
                                        db_column='isValidation')

    class Meta:
        """
        Frame model's Meta class specification
        """
        db_table = 'Frames'


class LabelData(models.Model):
    """
    LabelData model
    """
    id = models.BigAutoField(primary_key=True)
    data_proper = models.IntegerField(null=True, blank=True,
                                      db_column='dataProper')
    label_dataset = models.ForeignKey(LabelDataset, models.DO_NOTHING,
                                      db_column="labelDatasetId")
    is_void = models.BooleanField(null=True, blank=True, db_column='isVoid')
    parent_frame = models.ForeignKey(Frame, models.DO_NOTHING,
                                     db_column="parentFrame")
    t_one_HIT_id = models.CharField(null=True, blank=True, max_length=255,
                                    db_column='tOneHITid')
    t_two_HIT_id = models.CharField(null=True, blank=True, max_length=255,
                                    db_column='tTwoHITid')

    class Meta:
        """
        LabelData model's Meta class specification
        """
        db_table = 'LabelData'


class TypeCode(models.Model):
    """
    TypeCode model
    """
    id = models.BigAutoField(primary_key=True)
    type_name = models.CharField(max_length=255, db_column='typeName')
    order = models.IntegerField(null=True, blank=True, db_column='orderby')
    value = models.CharField(null=True, blank=True, max_length=3)
    short_description = models.CharField(null=True, blank=True, max_length=255,
                                         db_column='shortDescription')
    long_description = models.TextField(null=True, blank=True,
                                        db_column='longDescription')
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    created_by = models.CharField(null=True, blank=True, max_length=255)

    class Meta:
        """
        TypeCode model's Meta class specification
        """
        db_table = 'TypeCode'


class FileStorage(models.Model):
    """
    FileStorage model
    """
    id = models.BigAutoField(primary_key=True)
    file_type = models.CharField(null=True, blank=True, max_length=3,
                                 db_column='fileType')
    link = models.CharField(null=True, blank=True, max_length=255)

    class Meta:
        """
        FileStorage model's Meta class specification
        """
        db_table = 'FileStorage'


class DetectedObjects(models.Model):
    """
    DetectedObjects model
    """
    id = models.BigAutoField(primary_key=True)
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column="edgeNodeId")
    object_type = models.CharField(null=True, blank=True, max_length=3,
                                   db_column='objectType')
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    file = models.ForeignKey(FileStorage, models.DO_NOTHING,
                             db_column='fileId')
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')

    class Meta:
        """
        DetectedObjects model's Meta class specification
        """
        db_table = 'DetectedObjects'


class EventsHistory(models.Model):
    """
    EventsHistory model
    """
    id = models.BigAutoField(primary_key=True)
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column="edgeNodeId")
    event_type = models.CharField(null=True, blank=True, max_length=3,
                                  db_column='eventType')
    verification_result = models.CharField(null=True, blank=True, max_length=3,
                                           db_column='verificationResult')
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')

    class Meta:
        """
        EventsHistory model's Meta class specification
        """
        db_table = 'EventsHistory'


class DetectionsSummary(models.Model):
    """
    DetectionsSummary model
    """
    id = models.BigAutoField(primary_key=True)
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column="edgeNodeId")
    observation_date = models.DateField(null=True, blank=True,
                                        auto_now_add=True,
                                        db_column='observationDate')
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')

    class Meta:
        """
        DetectionsSummary model's Meta class specification
        """
        db_table = 'DetectionsSummary'


class RoadConditions(models.Model):
    """
    RoadConditions model
    """
    id = models.BigAutoField(primary_key=True)
    edge_node = models.ForeignKey(EdgeNode, models.DO_NOTHING,
                                  db_column="edgeNodeId")
    created_dt = models.DateTimeField(null=True, blank=True, auto_now_add=True)
    parameters = JSONField(null=True, blank=True, db_column='parametersJSON')

    class Meta:
        """
        RoadConditions model's Meta class specification
        """
        db_table = 'RoadConditions'


class Category(models.Model):
    """
    Manufacturer category model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'Categories'


class Manufacturer(models.Model):
    """
    Manufacturer model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    categories = models.ManyToManyField(Category,
                                        db_table='ManufacturerCategories')

    class Meta:
        db_table = 'Manufacturers'


class Device(models.Model):
    """
    Device model
    """
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=False)
    product_number = models.CharField(max_length=255, blank=False)
    buying_price = models.DecimalField(max_digits=16, blank=False, decimal_places=2, db_column='buyingPrice')
    sales_price = models.DecimalField(max_digits=16, blank=False, decimal_places=2, db_column='salesPrice')
    description = models.TextField(null=True)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.PROTECT,
                                     db_column='manufacturerId')
    seo_title = models.CharField(max_length=255, null=True, db_column='seoTitle')
    seo_keywords = models.CharField(max_length=255, null=True, db_column='seoKeywords')
    seo_description = models.TextField(null=True, db_column='seoDescription')
    published = models.BooleanField(default=True)
    images = JSONField(null=True)
    created_dt = models.DateTimeField(null=True, auto_now_add=True)

    class Meta:
        db_table = 'Devices'
