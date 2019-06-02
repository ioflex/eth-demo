pragma solidity >=0.4.21 <0.6.0;

// *** Token contract ***
// *** Used to define the ECR20 token ***
contract IOToken {
    // *** Name of the token ***
    // *** Optional for ERC20 standard ***
    // *** State variable ***
    // *** accessible using instance.name(); ***
    string public name = "Input Output Flexibility Token";

    // *** Symbol of the token ***
    // *** Optional for ERC20 standard ***
    // *** State variable ***
    // *** accessible using instance.symbol(); ***
    string public symbol = "IOFT";

    // *** Internal standard version of the token ***
    // *** State variable ***
    // *** accessible using instance.standard(); ***
    string public standard = "v0.0.0";

    // *** Total supply of tokens ***
    // *** Required for ERC20 standard ***
    // *** State variable ***
    // *** accessible using instance.totalSupply(); ***
    uint256 public totalSupply;

    // *** Balance of addresses ***
    // *** Required for ERC20 standard ***
    // *** State variable ***
    // *** accessible using instance.balanceOf(address);
    mapping(address => uint256) public balanceOf;

    // *** Delegated Transfer Allowances ***
    // *** Required for ERC20 standard ***
    // *** State variable ***
    mapping(address => mapping(address => uint256)) public allowance;

    // *** Approval event handler ***
    // *** Required ERC20 standard ***
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // *** Transfer event handler ***
    // *** Required ERC20 standard ***
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // *** Constructor ***
    // *** uint256 _initialSupply - local scope variable ***
    constructor (uint256 _initialSupply) public {

        // *** Allocate the initial supply ***
        // *** msg is a global variable in solidity ***
        // *** msg.sender is the address that called the contract ***
        balanceOf[msg.sender] = _initialSupply;

        // *** Set the total supply of tokens ***
        totalSupply = _initialSupply;
    }

    // *** Approve function ***
    // *** Required by ERC20 standard ***
    function approve(address _spender, uint256 _value) public returns(bool success){
        // *** set the allowance value ***
        allowance[msg.sender][_spender] = _value;
        // *** trigger approval event ***
        emit Approval(msg.sender, _spender, _value);

        // *** Return true if the function has executed this far. ***
        return true;
    }

    // *** Transfer function ***
    // *** Required by ERC20 standard ***
    // *** Exception: if account doesn't have enough supply for xfer ***
    // *** Returns: boolean ***
    function transfer(address _to, uint256 _value) public returns(bool success){
        // *** Ensure the sender has at least the desired amount of tokens to transfer ***
        require(balanceOf[msg.sender] >= _value, "balance not available to send.");

        // *** Deduct balance (_value) from sender ***
        balanceOf[msg.sender] -= _value;

        // *** Add balance (_value) to receiver ***
        balanceOf[_to] += _value;

        // *** Emit the transfer event ***
        emit Transfer(msg.sender, _to, _value);

        // *** Return true if the function has executed this far. ***
        return true;
    }

    // *** Transfer from function ***
    // *** "Delegated" Transfer ***
    // *** Required by ERC20 standard ***
    // *** Exception: if calling account allowance is not large enough to transfer value. ***
    // *** Exception: if spending account balance is not large enought to transfer value. ***
    // *** Returns: boolean ***
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        // *** Ensure the delegate's allowance is appropriate to transfer ***
        require(_value <= allowance[_from][msg.sender], "allowance is not large enough to transfer");
        // *** Ensure the _from account has enough tokens to transfer ***
        require(_value <= balanceOf[_from], "balance is not available to transfer");

        // *** Deduct balance (_value) from sender ***
        balanceOf[_from] -= _value;

        // *** Add balance (_value) to receiver ***
        balanceOf[_to] += _value;

        // *** Update the remaining allowance ***
        allowance[_from][msg.sender] -= _value;

        // *** Emit the transfer event ***
        emit Transfer(_from, _to, _value);

        // *** Return true if the function has executed this far. ***
        return true;
    }
}